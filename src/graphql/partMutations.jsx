import { gql } from '@apollo/client';

export const CREATE_PART = gql`
  mutation CreateItemPart($itemId: ID!, $name: String!, $description: String, $parentId:ID) {
    createItemPart(itemId: $itemId, name: $name, description: $description,  parentId: $parentId) {
        itemPart {
            id
            name
            description
        }
            errors
        }
    }
`;

export const UPDATE_PART = gql`
  mutation UpdateItemPart($id: ID!, $name: String!, $description: String, $parentId:ID) {
    updateItemPart(id: $id, name: $name, description: $description, parentId: $parentId ) {
      itemPart {
        id
        name
        description
      }
      errors
    }
  }
`;


export const DELETE_PART = gql`
  mutation DeleteItemPart($id: ID!) {
    deleteItemPart(id: $id) {
      success
      errors
    }
  }
`;
