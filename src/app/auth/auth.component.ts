import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  ComponentFactoryResolver,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder.directive';
import { ShoppingListComponent } from '../shopping-list/shopping-list.component';
import { AuthModel } from './auth.model';
import { AuthService } from './auth.service';
import { AuthResponseData, LoginResponseData } from './responses.model';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnDestroy {
  ackError() {
    this.error = null;
  }
  constructor(private authService: AuthService, private router: Router) {}
  ngOnDestroy(): void {
    if (this.closeSub) {
      this.closeSub.unsubscribe();
    }
  }
  isLoginMode = true;
  isLoading = false;
  error;
  closeSub: Subscription;
  authObs: Observable<AuthResponseData | LoginResponseData>;
  @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective;
  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const dto = new AuthModel(form.value.email, form.value.password);
    this.isLoading = true;
    if (!this.isLoginMode) {
      this.signUp(dto);
    } else {
      this.signIn(dto);
    }

    form.reset();
  }
  signIn(data: AuthModel) {
    this.authObs = this.authService.signIn(data.email, data.password);
    this.subscribe();
  }
  signUp(data: AuthModel) {
    this.authObs = this.authService.signUp(data.email, data.password);
    this.subscribe();
  }

  subscribe() {
    this.authObs.subscribe(
      (response: LoginResponseData | AuthResponseData) => {
        this.handleResponse(response);
        this.router.navigate(['/recipes']);
      },
      (error) => {
        this.handleError(error);
      }
    );
  }
  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
    this.error = null;
  }
  handleResponse(response: LoginResponseData | AuthResponseData) {
    console.log(response.idToken);
    this.isLoading = false;
  }
  handleError(error) {
    console.log(error);
    this.error = error;
    this.isLoading = false;
    this.showErrorAlert(error);
  }
  private showErrorAlert(message: string) {
    const hostVCRef = this.alertHost.viewContainerRef;
    hostVCRef.clear();
    const cmpRef = hostVCRef.createComponent(AlertComponent);
    cmpRef.instance.message = message;
    this.closeSub = cmpRef.instance.close.subscribe(() => {
      hostVCRef.clear();
      this.closeSub.unsubscribe();

    });
  }
}
