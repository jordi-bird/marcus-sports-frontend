import { gql } from '@apollo/client';

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
