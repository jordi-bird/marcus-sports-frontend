import { gql } from '@apollo/client';
/*
export const GET_ATTRIBUTE_OPTION = gql`
    query($itemPartAttributeOptionId: ID!) {
        itemPartAttributeOptionId(id: $itemPartAttributeOptionId) {
            id  
            name
        }
    }
`;
*/

export const GET_ATTRIBUTE_OPTIONS = gql`
    query GetItemPartAttributeOptions($itemPartAttributeId: ID!) {
        itemPartAttribute(id: $itemPartAttributeId) {
            name
            itemPartAttributeOptions {
                id
                name
                price
                stock
                rules {
                    id
                    sourceOption {
                        id
                        name
                    }
                    targetOption {
                        id
                        name
                    }
                    ruleType
                    reciprocal
                    operation
                    value
                }
            }
        }
    }
`;

