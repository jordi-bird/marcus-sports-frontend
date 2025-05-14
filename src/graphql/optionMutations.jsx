import { gql } from '@apollo/client';

export const CREATE_OPTION = gql`
  mutation CreateItemPartAttributeOption($input: CreateItemPartAttributeOptionInput!) {
    createItemPartAttributeOption(input: $input) {
      itemPartAttributeOption {
        id
        name
        price
        stock
        rules {
          ruleType
          targetOption {
            id
          }
          reciprocal
          operation
          value
        }
      }
      errors
    }
  }
`;

export const UPDATE_OPTION = gql`
  mutation UpdateItemPartAttributeOption($input: UpdateItemPartAttributeOptionInput!) {
    updateItemPartAttributeOption(input: $input) {
      itemPartAttributeOption {
        id
        name
        price
        stock
        rules {
          ruleType
          targetOption {
            id
          }
          reciprocal
          operation
          value
        }
      }
      errors
    }
  }
`;


export const DELETE_OPTION = gql`
  mutation DeleteItemPartAttributeOption($id: ID!) {
    deleteItemPartAttributeOption(id: $id){
      success
      errors
    }
  }
`;
