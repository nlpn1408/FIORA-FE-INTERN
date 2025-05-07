// Base error class for domain-specific errors
export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

// Error when an order cannot be found
export class OrderNotFoundError extends DomainError {
  constructor(orderNo: string) {
    super(`Order with number ${orderNo} not found.`);
  }
}

// Error for authorization issues (e.g., user trying to access an order they don't own)
export class AuthorizationError extends DomainError {
  constructor(message: string = 'User is not authorized to perform this action.') {
    super(message);
  }
}

// Generic error for invoice creation failures
export class InvoiceCreationError extends DomainError {
  constructor(message: string = 'Failed to create invoice request.') {
    super(message);
  }
}

// Error for when order details don't match user-provided information
export class OrderMismatchError extends DomainError {
  constructor(message: string = 'The information provided does not match the order records.') {
    super(message);
  }
}

// Success notification for order validation
export class OrderValidationSuccess extends DomainError {
  constructor(orderNo: string) {
    super(`Success: Order ${orderNo} has been validated successfully.`);
  }
}
