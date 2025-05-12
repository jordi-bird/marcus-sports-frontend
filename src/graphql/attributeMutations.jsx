import { gql } from '@apollo/client';

export const CREATE_ATTRIBUTE = gql`
  mutation CreateItemPartAttribute($itemPartId: ID!, $name: String!) {
    createItemPartAttribute(itemPartId: $itemPartId, name: $name) {
        itemPartAttribute {
            id
            name
        }
        errors
        }
    }
`;

export const UPDATE_ATTRIBUTE = gql`
  mutation UpdateItemPartAttribute($id: ID!, $name: String!) {
    updateItemPartAttribute(id: $id, name: $name) {
      itemPartAttribute {
        id
        name
      }
      errors
    }
  }
`;


export const DELETE_ATTRIBUTE = gql`
  mutation DeleteItemPartAttribute($id: ID!) {
    deleteItemPartAttribute(id: $id) {
      success
      errors
    }
  }
`;
