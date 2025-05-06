import { gql } from '@apollo/client';

export const GET_ITEMS = gql`
  query GetItems {
    items {
      id
      name
      description
    }
  }
`;

export const GET_ITEM_DETAILS = gql`
  query GetItem($id: ID!) {
    item(id: $id) {
      id
      name
      description
      itemParts {
        id
        name
        partAttributes {
          id
          name
          price
        }
      }
    }
  }
`;


export const GET_ITEM_PARTS = gql`
  query GetItemParts {
    itemParts {
      id
      name
      partAttributes {
        id
        name
        price
      }
    }
  }
`;
