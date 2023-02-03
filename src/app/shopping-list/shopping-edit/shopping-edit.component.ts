import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs-compat';
import { Ingredient } from '../../shared/models/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css'],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  deleteItem() {
    this.shoppingListService.removeIngredient(this.editIndex);
    this.clearForm();
  }
  clearForm() {
    this.editMode = false;
    this.form.reset();
  }
  // @ViewChild('nameInput')
  // nameInput:ElementRef;
  // @ViewChild('amountInput',{static:false})
  // amountInput:ElementRef;
  @ViewChild('f')
  form: NgForm;
  editMode = false;
  editItem: Ingredient;
  sub: Subscription;
  editIndex: number;

  constructor(private shoppingListService: ShoppingListService) {}
  ngOnInit(): void {
    this.sub = this.shoppingListService.ingredientEdit.subscribe(
      (index: number) => {
        this.editMode = true;
        this.editIndex = index;
        this.editItem = this.shoppingListService.getIngredient(index);
        this.form.setValue({
          name: this.editItem.name,
          amount: this.editItem.amount,
        });
      }
    );
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  handleSubmit(form: NgForm) {
    // this.shoppingListService.addIngredient(
    //  new Ingredient(this.nameInput.nativeElement.value,
    //    this.amountInput.nativeElement.value)
    // )
    if (this.editMode === false) {
      this.shoppingListService.addIngredient(
        new Ingredient(form.value.name, form.value.amount)
      );
    } else {
      this.shoppingListService.updateIngredient(
        this.editIndex,
        new Ingredient(form.value.name, form.value.amount)
      );
    }
    this.clearForm();

    console.log(form);
  }
}
