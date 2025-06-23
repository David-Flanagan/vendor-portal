# @beach-box/schemas

TypeScript-first schema validation library for the Beach Box monorepo, built with Zod. Provides comprehensive validation schemas for Beach Box locations, machines, user management, partnerships, and more.

## Features

- **🔒 Type Safety**: Full TypeScript integration with runtime validation
- **📍 Location Management**: Schemas for Beach Box locations and machine tracking
- **👥 User & Partnership**: Authentication and partnership inquiry validation
- **📧 Contact Forms**: Complete contact and inquiry form validation
- **🏖️ Beach Box Business**: Product, sales, and analytics schemas
- **🛡️ Runtime Validation**: Catch data issues at runtime, not in production
- **📊 API Schemas**: Standardized request/response validation
- **🔄 Transformation**: Data parsing and transformation utilities

## Installation

```bash
pnpm add @beach-box/schemas
```

## Quick Start

```typescript
import { ContactFormSchema, BeachBoxLocationSchema, validateData } from '@beach-box/schemas';

// Validate contact form data
const contactResult = validateData(ContactFormSchema, formData);
if (contactResult.success) {
  console.log('Valid contact form:', contactResult.data);
} else {
  console.error('Validation errors:', contactResult.error.errors);
}

// Validate location data
const location = BeachBoxLocationSchema.parse({
  id: 'loc-123',
  name: 'South Beach Miami',
  address: {
    street: '1234 Ocean Drive',
    city: 'Miami Beach',
    state: 'FL',
    zip: '33139',
  },
  coordinates: { lat: 25.7617, lng: -80.1918 },
  status: 'active',
  operatingHours: { open: '06:00', close: '22:00' },
  createdAt: new Date(),
  updatedAt: new Date(),
});
```

## Available Schemas

### Core Types

Import commonly used types and schemas:

```typescript
import { UserSchema, BeachBoxLocationSchema, ContactFormSchema } from '@beach-box/schemas';
import type { User, BeachBoxLocation, ContactForm } from '@beach-box/schemas';

// Type inference from schema
type BeachBoxLocation = z.infer<typeof BeachBoxLocationSchema>;
```

### Schema Categories

#### 🏖️ Beach Box Location Management

**Location Schemas:**
- `BeachBoxLocationSchema` - Complete location with address, status, and operating hours
- `LocationStatusSchema` - Location operational status validation
- `AddressSchema` - US address validation with zip code patterns

**Machine Schemas:**
- `MachineSchema` - Beach Box machine tracking and status
- `MachineStatusSchema` - Machine operational status validation

```typescript
// Location management
const location = BeachBoxLocationSchema.parse({
  id: 'loc-456',
  name: 'Clearwater Beach',
  address: {
    street: '123 Beach Walk',
    city: 'Clearwater',
    state: 'FL',
    zip: '33767',
  },
  coordinates: { lat: 27.9659, lng: -82.8001 },
  status: 'active',
  amenities: ['restrooms', 'parking', 'food_court'],
  operatingHours: { open: '07:00', close: '21:00' },
  createdAt: new Date(),
  updatedAt: new Date(),
});

// Machine tracking
const machine = MachineSchema.parse({
  id: 'machine-789',
  serialNumber: 'BB-2024-001',
  locationId: 'loc-456',
  status: 'operational',
  currentStock: 45,
  maxCapacity: 60,
  totalSales: 1250.75,
  createdAt: new Date(),
  updatedAt: new Date(),
});
```

#### 🤝 Partnership & Business Development

**Partnership Schemas:**
- `PartnershipInquirySchema` - Complete partnership application
- `PartnershipTypeSchema` - Business partnership categories
- `ContactFormSchema` - General contact and inquiry forms

```typescript
// Partnership inquiry validation
const partnershipInquiry = PartnershipInquirySchema.parse({
  contactInfo: {
    name: 'John Smith',
    email: 'john@beachresort.com',
    phone: '+1-555-0123',
    subject: 'Partnership Opportunity',
    message: 'Interested in installing Beach Box at our resort',
  },
  partnershipType: 'hotel_resort',
  businessName: 'Oceanview Resort',
  businessAddress: {
    street: '789 Beachfront Blvd',
    city: 'Key West',
    state: 'FL',
    zip: '33040',
  },
  expectedFootTraffic: 'high',
  hasExistingAmenities: true,
  additionalInfo: 'We have 3 beach access points',
});
```

#### 👥 User Management & Authentication

**User Schemas:**
- `UserSchema` - User profile and role management
- `LoginRequestSchema` / `LoginResponseSchema` - Authentication flow
- `RegisterRequestSchema` - User registration validation

```typescript
// User authentication
const loginRequest = LoginRequestSchema.parse({
  email: 'partner@example.com',
  password: 'securePassword123',
});

const user = UserSchema.parse({
  id: '550e8400-e29b-41d4-a716-446655440000',
  email: 'partner@beachresort.com',
  name: 'Beach Resort Manager',
  role: 'partner',
  createdAt: new Date(),
  updatedAt: new Date(),
});
```

#### 🏖️ Product & Sales Management

**Product Schemas:**
- `SunscreenProductSchema` - Sunscreen product catalog
- `SalesDataSchema` - Sales tracking and analytics

```typescript
// Product catalog
const product = SunscreenProductSchema.parse({
  id: 'spf50-sport-4oz',
  name: 'Sport Sunscreen SPF 50',
  spf: 50,
  size: '4oz',
  price: 12.99,
  waterResistant: true,
  ingredients: ['zinc oxide', 'titanium dioxide', 'aloe vera'],
  description: 'Water-resistant sport sunscreen for active beachgoers',
});

// Sales tracking
const salesData = SalesDataSchema.parse({
  date: new Date(),
  locationId: 'loc-456',
  machineId: 'machine-789',
  productId: 'spf50-sport-4oz',
  quantity: 3,
  revenue: 38.97,
});
```

### Advanced Validation

#### Custom Validation Rules

Create complex validation with custom business logic:

```typescript
// Custom location validation with business rules
const validateLocationCapacity = (location: BeachBoxLocation) => {
  const rules = {
    minDistanceFromWater: 50, // meters
    maxMachinesPerLocation: 3,
    requiredAmenities: ['restrooms'],
  };

  // Custom validation logic
  if (!location.amenities.includes('restrooms')) {
    throw new Error('Location must have restroom facilities');
  }

  return location;
};

// Enhanced contact form with conditional validation
const EnhancedContactSchema = ContactFormSchema.extend({
  businessName: z.string().optional(),
  partnershipInterest: z.boolean(),
}).refine(
  (data) => {
    // Require business name if interested in partnership
    if (data.partnershipInterest && !data.businessName) {
      return false;
    }
    return true;
  },
  {
    message: 'Business name is required for partnership inquiries',
    path: ['businessName'],
  }
);
```

#### Error Handling & Reporting

```typescript
// Comprehensive error handling
class BeachBoxValidationError extends Error {
  constructor(message: string, field: string, locationId?: string) {
    super(message);
    this.name = 'BeachBoxValidationError';
    this.field = field;
    this.locationId = locationId;
  }

  field: string;
  locationId?: string;
}

// Validation with custom error handling
const validateMachineStatus = (machine: Machine) => {
  if (machine.currentStock < 0) {
    throw new BeachBoxValidationError(
      'Stock level cannot be negative',
      'currentStock',
      machine.locationId
    );
  }

  if (machine.currentStock === 0 && machine.status === 'operational') {
    throw new BeachBoxValidationError(
      'Machine cannot be operational with zero stock',
      'status',
      machine.locationId
    );
  }

  return machine;
};
```

## Schema Reference

### Complete Schema List

**Core Business Schemas:**
- `UserSchema`, `BeachBoxLocationSchema`, `MachineSchema`
- `SunscreenProductSchema`, `SalesDataSchema`

**Form & Communication Schemas:**
- `ContactFormSchema`, `PartnershipInquirySchema`
- `LoginRequestSchema`, `RegisterRequestSchema`

**API & System Schemas:**
- `ApiErrorSchema`, `PaginationSchema`, `PaginatedResponseSchema`

**Validation Utilities:**
- `validateData()` - Safe parsing with success/error result
- `phoneNumberRegex`, `zipCodeRegex`, `emailRegex` - Common patterns

### Type Exports

```typescript
// Import all types
import type {
  User,
  BeachBoxLocation,
  Machine,
  ContactForm,
  PartnershipInquiry,
  SunscreenProduct,
  SalesData,
  LocationStatus,
  MachineStatus,
  PartnershipType,
} from '@beach-box/schemas';
```

## Best Practices

### 1. Schema Composition

Build complex schemas from simpler ones:

```typescript
// Compose schemas for different use cases
const CreateLocationRequest = BeachBoxLocationSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

const UpdateLocationRequest = BeachBoxLocationSchema.partial().required({
  id: true,
});
```

### 2. Validation Pipelines

Chain validations for comprehensive data checking:

```typescript
const validateAndProcessLocation = (data: unknown) => {
  // Step 1: Schema validation
  const location = BeachBoxLocationSchema.parse(data);

  // Step 2: Business rule validation
  validateLocationCapacity(location);

  // Step 3: Additional processing
  return {
    ...location,
    slug: location.name.toLowerCase().replace(/\s+/g, '-'),
  };
};
```

### 3. Error Handling

Always handle validation errors gracefully:

```typescript
const processContactForm = async (formData: unknown) => {
  try {
    const validatedData = ContactFormSchema.parse(formData);
    await submitContactForm(validatedData);
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      };
    }
    throw error;
  }
};
```

## Migration & Updates

When updating schemas, follow these patterns:

1. **Backward Compatibility**: Use optional fields for new properties
2. **Version Schemas**: Create versioned schemas for breaking changes
3. **Migration Helpers**: Provide utilities to transform old data

```typescript
// Schema versioning
export const BeachBoxLocationSchemaV1 = BeachBoxLocationSchema;
export const BeachBoxLocationSchemaV2 = BeachBoxLocationSchema.extend({
  timezone: z.string().default('America/New_York'),
  weatherAPIKey: z.string().optional(),
});

// Migration utility
export const migrateLocationV1toV2 = (v1Data: z.infer<typeof BeachBoxLocationSchemaV1>) => {
  return BeachBoxLocationSchemaV2.parse({
    ...v1Data,
    timezone: 'America/New_York', // Default for all Florida locations
  });
};
```

## Contributing

When adding new schemas:

1. Follow existing naming conventions
2. Add comprehensive JSDoc comments
3. Include usage examples in tests
4. Update this README with new schemas

---

**Part of the Beach Box Monorepo** 🏖️