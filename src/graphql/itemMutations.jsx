import { gql } from '@apollo/client';

export const CREATE_ITEM = gql`
  mutation CreateItem($name: String!, $description: String) {
    createItem(name: $name, description: $description) {
      success
      item {
        id
        name
        description
      }
      errors
    }
  }
`;

export const UPDATE_ITEM = gql`
  mutation UpdateItem($id: ID!, $name: String!, $description: String) {
    updateItem(id: $id, name: $name, description: $description) {
      success
      errors
      item {
        id
        name
        description
      }
    }
  }
`;


export const DELETE_ITEM = gql`
  mutation DeleteItem($id: ID!) {
    deleteItem(id: $id) {
      success
      errors
    }
  }
`;
