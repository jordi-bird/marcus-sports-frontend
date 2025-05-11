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

export const GET_ITEM = gql`
  query($itemId: ID!) {
      item(id: $itemId) {
        id
        name
        description
        itemParts {
          id
          name
          description
          children {
            id
            name
            description
            itemPartAttributes {
              id
              name
              itemPartAttributeOptions {
                id
                name
                price
                stock
                rules {
                  sourceOption {
                    id
                    name
                  }
                  targetOption {
                    id
                    name
                  }
                  targetPart {
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
          itemPartAttributes {
            id
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
                targetPart {
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
      }
  }
`;



export const GET_ITEM_PARTS = gql`
    query($itemId: ID!) {
        item(id: $itemId) {
            name
            itemParts {
                id  
                name
                description
                children {
                    id
                }
            }
        }
    }
`;

export const GET_ITEM_PART_ATTRIBUTES = gql`
    query($itemPartId: ID!) {
        itemPart(id: $itemPartId) {
            id  
            name
            description
            itemPartAttributes {
                id
                name
            }
        }
    }
`;

export const GET_ITEM_PART_ATTRIBUTE_OPTIONS = gql`
    query($itemPartAttributeId: ID!) {
        itemPartAttribute(id: $itemPartAttributeId) {
            id  
            name
            itemPartAttributeOptions {
                id
                name
                price
                stock
                rules {
                    sourceOption {
                        id
                        name
                    }
                    targetOption {
                        id
                        name
                    }
                    targetPart {
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

/*
{
  items {
    itemParts {
      name
      description
      children {
        name
        description
        itemPartAttributes {
          name
          itemPartAttributeOptions {
            name
            price
            stock
            rules {
              sourceOption {
                id
                name
              }
              targetOption {
                id
                name
              }
              targetPart {
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
      itemPartAttributes {
        name
        itemPartAttributeOptions {
          name
          price
          stock
          rules {
            sourceOption {
              id
              name
            }
            targetOption {
              id
              name
            }
            targetPart {
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
  }
}
  */


