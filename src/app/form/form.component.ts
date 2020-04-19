import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { TodoState } from '../store/todo.state';
import { Observable, Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UpdateTodo, AddTodo, SetSelectedTodo } from '../store/todo.action';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
})
export class FormComponent implements OnInit {

  @Select(TodoState.getSelectedTodo) selectedTodo: Observable<any>

  todoForm: FormGroup;
  editTodo = false;
  private formSubscription: Subscription = new Subscription();


  constructor(
    private fb: FormBuilder, 
    private store: Store, 
    private route: ActivatedRoute, 
    private router: Router
    ) { 
      this.createForm()
    }

  ngOnInit() {
    this.formSubscription.add(
      this.selectedTodo.subscribe(todo => {
        if (todo) {
          this.todoForm.patchValue({
            id: todo.id,
            userId: todo.userId,
            title: todo.title
          });
          this.editTodo = true;
        } else {
          this.editTodo = false;
        }
      })
    );
    
    console.log("F",this.selectedTodo)
    this.selectedTodo.subscribe(s=>console.log("F2",s))
  }

  createForm() {
    this.todoForm = this.fb.group({
        id: [''],
        userId: ['', Validators.required],
        title: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.editTodo) {
      this.formSubscription.add(
        this.store.dispatch(new UpdateTodo(this.todoForm.value, this.todoForm.value.id)).subscribe(() => {
          this.clearForm();
        })
      );
    } else {
      this.formSubscription.add(
        this.formSubscription = this.store.dispatch(new AddTodo(this.todoForm.value)).subscribe(() => {
          this.clearForm();
        })
      );
    }
  }

  clearForm() {
    this.todoForm.reset();
    this.store.dispatch(new SetSelectedTodo(null));
  }

}
