import { db } from './db';
import { businesses, locations, forms, qrCodes, feedback } from '../shared/schema';
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function seedDatabase() {
  console.log('Starting database seeding...');

  // Create test business
  const testBusiness = await db.insert(businesses).values({
    businessName: 'Demo Business',
    email: 'demo@example.com',
    password: await hashPassword('password123'),
    phone: '+123456789',
    subscriptionPlan: 'Pro',
  }).returning();
  
  console.log('Created test business:', testBusiness[0]);
  
  const businessId = testBusiness[0].id;

  // Create locations
  const testLocations = await db.insert(locations).values([
    {
      businessId,
      name: 'Downtown Branch',
      address: '123 Main St, Downtown',
      latitude: '40.7128',
      longitude: '-74.0060',
    },
    {
      businessId,
      name: 'Uptown Branch',
      address: '456 Park Ave, Uptown',
      latitude: '40.7528',
      longitude: '-73.9765',
    },
  ]).returning();
  
  console.log('Created test locations:', testLocations);
  
  // Create feedback forms
  const customerServiceFormFields = {
    fields: [
      {
        id: '1',
        type: 'starRating',
        label: 'How would you rate our customer service?',
        required: true,
      },
      {
        id: '2',
        type: 'longText',
        label: 'Please share your feedback about our service',
        required: false,
        placeholder: 'Tell us what you think...',
      },
      {
        id: '3',
        type: 'contactInfo',
        label: 'Leave your contact information (optional)',
        required: false,
      },
      {
        id: '4',
        type: 'submitButton',
        label: 'Submit Feedback',
        required: true,
      },
    ]
  };

  const productFeedbackFormFields = {
    fields: [
      {
        id: '1',
        type: 'multipleChoice',
        label: 'Which product did you purchase?',
        required: true,
        options: ['Product A', 'Product B', 'Product C', 'Other'],
      },
      {
        id: '2',
        type: 'scaleRating',
        label: 'How likely are you to recommend our product?',
        required: true,
        min: 1,
        max: 10,
      },
      {
        id: '3',
        type: 'longText',
        label: 'What improvements would you suggest?',
        required: false,
        placeholder: 'Your suggestions help us improve...',
      },
      {
        id: '4',
        type: 'imageUpload',
        label: 'Upload a photo (optional)',
        required: false,
      },
      {
        id: '5',
        type: 'submitButton',
        label: 'Submit Product Feedback',
        required: true,
      },
    ]
  };

  const testForms = await db.insert(forms).values([
    {
      businessId,
      name: 'Customer Service Feedback',
      description: 'Get feedback about our customer service',
      fields: customerServiceFormFields,
    },
    {
      businessId,
      name: 'Product Feedback',
      description: 'Get feedback about our products',
      fields: productFeedbackFormFields,
    },
  ]).returning();
  
  console.log('Created test forms:', testForms);

  // Create QR codes
  const testQRCodes = await db.insert(qrCodes).values([
    {
      businessId,
      formId: testForms[0].id,
      locationId: testLocations[0].id,
      name: 'Downtown Service Feedback',
      scanCount: 15,
    },
    {
      businessId,
      formId: testForms[1].id,
      locationId: testLocations[1].id,
      name: 'Uptown Product Feedback',
      scanCount: 23,
    },
  ]).returning();
  
  console.log('Created test QR codes:', testQRCodes);

  // Create some feedback submissions
  const testFeedbackSubmissions = await db.insert(feedback).values([
    {
      qrCodeId: testQRCodes[0].id,
      formId: testForms[0].id,
      businessId,
      locationId: testLocations[0].id,
      response: {
        '1': 5, // 5-star rating
        '2': 'Great service, the staff was very helpful and attentive!'
      },
      rating: 5,
      sentiment: 'Positive',
      customerName: 'John Smith',
      customerEmail: 'john@example.com',
      mediaUrls: [],
      isAnonymous: false,
    },
    {
      qrCodeId: testQRCodes[0].id,
      formId: testForms[0].id,
      businessId,
      locationId: testLocations[0].id,
      response: {
        '1': 3, // 3-star rating
        '2': 'Service was okay but had to wait too long.'
      },
      rating: 3,
      sentiment: 'Neutral',
      customerName: null,
      customerEmail: null,
      mediaUrls: [],
      isAnonymous: true,
    },
    {
      qrCodeId: testQRCodes[1].id,
      formId: testForms[1].id,
      businessId,
      locationId: testLocations[1].id,
      response: {
        '1': 'Product A',
        '2': 9, // 9/10 rating
        '3': 'Love the product, but would like more color options.'
      },
      rating: 9,
      sentiment: 'Positive',
      customerName: 'Sarah Jones',
      customerEmail: 'sarah@example.com',
      mediaUrls: [],
      isAnonymous: false,
    },
    {
      qrCodeId: testQRCodes[1].id,
      formId: testForms[1].id,
      businessId,
      locationId: testLocations[1].id,
      response: {
        '1': 'Product C',
        '2': 2, // 2/10 rating
        '3': 'The product broke after one week. Very disappointed.'
      },
      rating: 2,
      sentiment: 'Negative',
      customerName: null,
      customerEmail: null,
      mediaUrls: [],
      isAnonymous: true,
    },
  ]).returning();
  
  console.log('Created test feedback submissions:', testFeedbackSubmissions);

  console.log('Database seeding completed successfully!');
}

// Run the seeding function
seedDatabase()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error seeding database:', error);
    process.exit(1);
  });