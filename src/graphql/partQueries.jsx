import { gql } from '@apollo/client';

export const GET_ITEM_PART = gql`
    query GetItemParts($itemPartId: ID!) {
        itemPart(id: $itemPartId) {
            id  
            name
            description
            parentId
        }
    }
`;

