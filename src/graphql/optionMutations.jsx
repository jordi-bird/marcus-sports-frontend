import { gql } from '@apollo/client';

export const CREATE_OPTION = gql`
  mutation CreateItemPartAttributeOption($itemPartAttributeId: ID!, $name: String!) {
    createItemPartAttributeOption(itemPartAttributeId: $itemPartAttributeId, name: $name) {
        itemPartAttributeOption {
            id
            name
        }
        errors
        }
    }
`;

export const UPDATE_OPTION = gql`
  mutation UpdateItemPartAttributeOption($id: ID!, $name: String!) {
    updateItemPartAttributeOption(id: $id, name: $name) {
      itemPartAttributeOption {
        id
        name
      }
      errors
    }
  }
`;


export const DELETE_ATTRIBUTE = gql`
  mutation DeleteItemPartAttributeOption($id: ID!) {
    deleteItemPartAttributeOption(id: $id) {
      success
      errors
    }
  }
`;
