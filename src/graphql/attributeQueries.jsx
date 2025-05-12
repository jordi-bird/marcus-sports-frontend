import { gql } from '@apollo/client';

export const GET_ITEM_PART_ATTRIBUTE = gql`
    query GetItemPartAttributes($itemPartAttributeId: ID!) {
        itemPartAttributeId(id: $itemPartAttributeId) {
            id  
            name
        }
    }
`;

export const GET_ITEM_PART_ATTRIBUTES = gql`
    query GetItemPartAttributes($itemPartId: ID!) {
        itemPart(id: $itemPartId) {
            id
            __typename
            name
            description
            itemPartAttributes {
                id
                __typename
                name
            }
        }
    }
`;