import { Ingredient } from '../../shared/ingredient.model';
import * as ShoppingListActions from './shopping-list.actions';

// This is the slice of the app's Store that this reducer
// ( which is the reducer of the shopping-list feature)
// is going to interat with

export interface State {
  ingredients: Ingredient[];
  editedIngredient: Ingredient;
  editedIngredientIndex: number;
}

const initialState: State = {
  ingredients: [new Ingredient('Apples',5),new Ingredient('Banana',4)],
  editedIngredient: null,
  editedIngredientIndex: -1
};

// the function will be automatically called by ngRx and will be given the two parameters
// we are here assigning the js object as the initial state of the app, for demonstration purposes
// thats a TS feature, we can assign default values to function parameters in case they are not given by the caller
// so the first time the app state will be set to the default value we give it but for subsequent calls
// the state will always be the previous state
export function shoppingListReducer(state: State = initialState, action: ShoppingListActions.ShoppingListActions) {
  switch(action.type) {
    case ShoppingListActions.ADD_INGREDIENT:
      // copy of state
      // remember : THE UPDATE OF STATE MUST HAPPEN IMMUTABLY
      // WE MUST NOT TOUCH THE STATE OBJECT
      return {
        ...state,
        ingredients: [...state.ingredients, action.payload]
      };
    case ShoppingListActions.ADD_INGREDIENTS:
      return {
        ...state,
        ingredients: [...state.ingredients, ...action.payload]
      }
    case ShoppingListActions.UPDATE_INGREDIENT:
      // getting the specific ingredient that we want to override from the state
      const ingredient = state.ingredients[state.editedIngredientIndex];
      // copying the ingredient into another object because we cant directly touch the Store
      // NgRx STRONGLY SUGGESTS THAT REDUCERS AFFECT THE STORE IMMUTABLY
      // NOTE: The '...ingredient' is redundant because we coyld just enter the new ingredient
      // but in case that we had some other property that we wanted to be overriden we would have to use it
      const updatedIngredient = {
        ...ingredient,
        ...action.payload
      };
      // preparing the updated ingredients array that is going to replace the one in the Store
      const updatedIngredients = [...state.ingredients];
      // this is the final array that we are going to return
      updatedIngredients[state.editedIngredientIndex] = updatedIngredient;
      return {
        ...state,
        ingredients: updatedIngredients,
        editedIngredient: null,
        editedIngredientIndex: -1
      };
    case ShoppingListActions.DELETE_INGREDIENT:
      return {
        ...state,
        // this is the vanilla JS filter method
        ingredients: state.ingredients.filter( (ingredient, index) => {
          return index !== state.editedIngredientIndex;
        }),
        editedIngredient: null,
        editedIngredientIndex: -1
      };
    case ShoppingListActions.START_EDIT:
      return {
        ...state,
        editedIngredientIndex: action.payload,
        // again we dont want to return the reference of the ingredient in the stor
        // we want to create a copy of that ingredient
        editedIngredient: { ...state.ingredients[action.payload] }
      }
    case ShoppingListActions.STOP_EDIT:
      return {
        ...state,
        editedIngredient: null,
        editedIngredientIndex: -1
      }
    default:
      return state;
  }
}
