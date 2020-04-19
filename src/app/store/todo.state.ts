import { State, Action, StateContext, Selector } from '@ngxs/store'
import { Todo } from '../models/Todo'
import { AddTodo, DeleteTodo, GetTodos, UpdateTodo, SetSelectedTodo } from './todo.action'
import { TodoService } from '../services/todo.service'
import { tap } from 'rxjs/operators'

@State({
  name: 'todos',
  defaults: {
    todos: [],
    selectedTodo: null
  }
})

export class TodoState {
  constructor(private todoService: TodoService){}

  @Selector()
  static getTodoList(state){
    return state.todos
  }

  @Selector()
  static getSelectedTodo(state){
    return state.selectedTodo
  }

  @Action(GetTodos)
  getTodos({getState, setState}: StateContext<any>){
    return this.todoService.getTodos().pipe( tap( result => {
      const state = getState();
      setState({
        ...state,
        todos: result
      });
    }));
  }

  @Action(AddTodo)
  addTodo({getState, patchState}: StateContext<any>, {payload}: AddTodo){
    return this.todoService.addTodo(payload).pipe(tap( result => {
      const state = getState();
      patchState({
        todos: [...state, result]
      })
    }))
  }

  @Action(UpdateTodo)
  updateTodo({getState, setState}: StateContext<any>, {payload, id}: UpdateTodo){
    return this.todoService.updateTodo(payload, id).pipe( tap( result => {
      const state = getState();
      const todoList = [...state.todos];
      const todoIndex = todoList.findIndex(item => item.id === id);
      todoList[todoIndex] = result;
      setState({
        ...state,
        todos: todoList
      });
    }));
  }

  @Action(DeleteTodo)
    deleteTodo({getState, setState}: StateContext<any>, {id}: DeleteTodo) {
        return this.todoService.deleteTodo(id).pipe(tap(() => {
            const state = getState();
            const filteredArray = state.todos.filter(item => item.id !== id);
            setState({
                ...state,
                todos: filteredArray,
            });
        }));
    }

    @Action(SetSelectedTodo)
    setSelectedTodoId({getState, setState}: StateContext<any>, {payload}: SetSelectedTodo) {
        const state = getState();
        setState({
            ...state,
            selectedTodo: payload
        });
    }

}