import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { TodoState } from '../store/todo.state';
import { Observable } from 'rxjs';
import { GetTodos, DeleteTodo, UpdateTodo, SetSelectedTodo } from '../store/todo.action';
import { Todo } from '../models/Todo';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
})
export class ListComponent implements OnInit {

  @Select(TodoState.getTodoList) todos: Observable<any>

  constructor(private store: Store) { }

  ngOnInit() {
    this.store.dispatch(new GetTodos())
    this.todos.subscribe(s => console.log(s))
    //console.log(this.todos)
  }

  deleteTodo(id:number){
    this.store.dispatch(new DeleteTodo(id))
  }

  editTodo(payload: Todo){
    this.store.dispatch(new SetSelectedTodo(payload))
  }

}
