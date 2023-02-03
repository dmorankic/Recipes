import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable} from 'rxjs';
import { DataStorageService } from './data-storage.service';
import { Recipe } from './recipes/recipe.model';

@Injectable({
  providedIn: 'root',
})
export class RecipeResolver implements Resolve<Recipe[]> {
  constructor(
    private datastorage: DataStorageService,
  ) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Recipe[]> {
    return this.datastorage.fetchData();
  }
}
