# 🖥️ Frontend

Built with React, split into two flows:
- **Product Configuration** (customer-facing)
- **Back Office** (admin-only)

#### Product Configuration

Flow to assemble a product with real-time updates.

##### Components

- **Item Configurator**:
  - Holds selected options
  - Stores selected `single-compatibility` rules
  - Calculates final price
  - Checks if all required options are selected to proceed to checkout

- **Part Section**:
  - Manages child parts recursively
  - Groups all attributes under a part

- **Attribute Block**:
  - Core logic for option selection
  - Evaluates whether each option is elegible based on:
    - `Incompatible`
    - `Blocked by Single Compatibility (there is a selected option that is source rule)`
    - `Blocked by Previous Selection (the option (source) is only compatible with another option (target) which is not selected, but the target attribute has another selected option)`
    - `Out of Stock`

- **Option Selector**:
  - Renders UI for selectable options
  - Displays tooltips with rule info (currently verbose for testing)
  - Triggers selection changes

#### Back Office

CRUD UI for all entities.

- **ItemForm**
- **ItemPartForm**
- **AttributeList** & **AttributeForm**
- **OptionList** & **OptionForm**
- **RuleList**

Each form allows create, edit, and delete actions. Option forms include rule management for simplicity.

---
<img src="public/frontend.png" alt="Frontend" width="800"/>
