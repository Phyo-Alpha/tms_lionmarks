# Validator Usage Guide

## ✅ **Correct Usage Pattern**

### Basic Example:

```php
// Initialize validator with POST data
$validator = new Validator($_POST);

// Validate fields with method chaining
$validator->required()->validate('firstName');
$validator->required()->validate('lastName');
$validator->email()->required()->validate('email');

// Check if validation passed
if ($validator->hasErrors()) {
    // Get all validation errors
    $errors = $validator->getAllErrors();
} else {
    // Process the form
}
```

### Complete Example from `register/index.php`:

```php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Initialize validator
    $validator = new Validator($_POST);

    // Chain validation rules
    $validator->required()->validate('firstName');
    $validator->required()->validate('lastName');
    $validator->email()->required()->validate('email');
    $validator->required()->validate('phone');

    // Check for errors
    if ($validator->hasErrors()) {
        $validation_errors = $validator->getAllErrors();
        foreach ($validation_errors as $field => $error_messages) {
            if (is_array($error_messages)) {
                foreach ($error_messages as $error) {
                    $errors[] = $error;
                }
            } else {
                $errors[] = $error_messages;
            }
        }
    } else {
        // Validation passed - process form
        saveToDatabase($_POST);
    }
}
```

## 🔍 **Why IntelliSense Doesn't Work for Chained Methods**

### The Issue:

You noticed that IntelliSense works for `required()` but not for `validate()` when chaining:

```php
$validator->required()->validate('field'); // IntelliSense only works for required()
```

### The Reason:

1. **Method Chaining Returns `$this`**:

   ```php
   public function required($message = null)
   {
       $this->setRule(__FUNCTION__, function ($val) {
           // validation logic
       }, $message);

       return $this; // Returns the Validator instance
   }
   ```

2. **Missing Return Type Declarations**:
   The Validator class was written before PHP had good return type hints. Modern code would look like:

   ```php
   public function required($message = null): self
   {
       // ... code ...
       return $this;
   }
   ```

3. **IDE Limitations**:
   - Without explicit return type hints (`@return self` or `: self`), IDEs have to **infer** the return type
   - When chaining methods, the IDE may lose track of the type after the first method call
   - This is a common issue with older PHP codebases

### Solutions:

#### **Option 1: Use PHPDoc Annotations**

Add type hints to help your IDE:

```php
/** @var Validator $validator */
$validator = new Validator($_POST);
$validator->required()->validate('firstName'); // IntelliSense should work now
```

#### **Option 2: Separate the Calls**

If IntelliSense is important for your workflow:

```php
$validator->required();
$validator->validate('firstName');
```

#### **Option 3: Update Your IDE**

- Make sure you're using the latest version of your IDE/editor
- Install PHP IntelliSense extensions (e.g., PHP Intelephense for VS Code)

#### **Option 4: Add Custom Annotations** (Advanced)

Create a `.phpstorm.meta.php` or similar file in your project root.

## 📚 **Available Validation Methods**

### Common Validators:

```php
// Required field
$validator->required()->validate('field');

// Email validation
$validator->email()->validate('email');

// Email + Required
$validator->email()->required()->validate('email');

// Minimum length
$validator->minLength(5)->validate('password');

// Maximum length
$validator->maxLength(100)->validate('description');

// Numeric
$validator->integer()->validate('age');

// URL
$validator->url()->validate('website');

// Pattern matching
$validator->hasPattern('/^[A-Z]+$/')->validate('code');

// Custom validation
$validator->callback(function($value) {
    return $value > 18;
}, 'Must be over 18')->validate('age');
```

### Checking Results:

```php
// Check if any errors exist
if ($validator->hasErrors()) {
    // Get all errors
    $allErrors = $validator->getAllErrors();

    // Get errors for specific field
    $emailErrors = $validator->getError('email');
}

// Get validated data
$validData = $validator->getValidData();
```

## 🎯 **Best Practices**

### 1. Initialize Once

```php
$validator = new Validator($_POST);
```

### 2. Chain Validation Rules

```php
// Good: Clear and concise
$validator->required()->email()->validate('email');

// Also Good: One rule per line for readability
$validator->required()->validate('firstName');
$validator->required()->validate('lastName');
```

### 3. Check Errors Before Processing

```php
if (!$validator->hasErrors()) {
    // Safe to process
    $data = $validator->getValidData();
}
```

### 4. Display Errors to Users

```php
if ($validator->hasErrors()) {
    foreach ($validator->getAllErrors() as $field => $errors) {
        foreach ((array)$errors as $error) {
            echo "<li>$error</li>";
        }
    }
}
```

## 🔧 **Custom Error Messages**

### Default Messages:

```php
$validator->required()->validate('name');
// Error: "This field is required"
```

### Custom Messages:

```php
$validator->required('Please enter your name')->validate('name');
// Error: "Please enter your name"
```

### Field Labels:

```php
$validator->required()->validate('firstName', false, 'First Name');
// Error: "First Name is required"
```

## 📝 **Real-World Example**

```php
// Registration form validation
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $validator = new Validator($_POST);

    // Personal info
    $validator->required('First name is required')->validate('firstName');
    $validator->required('Last name is required')->validate('lastName');
    $validator->email()->required('Valid email is required')->validate('email');

    // Contact info
    $validator->required('Phone number is required')->validate('phone');
    $validator->required('Country code is required')->validate('countryCode');

    // Additional validation
    $validator->required('Date of birth is required')->validate('dob');
    $validator->required('Nationality is required')->validate('nationality');
    $validator->required('Address is required')->validate('address');

    // Process
    if ($validator->hasErrors()) {
        // Handle errors
        $errors = $validator->getAllErrors();
    } else {
        // Save to database
        $validData = $validator->getValidData();
        saveToDatabase($validData);
    }
}
```

## 🚀 **Summary**

✅ **Correct**: `$validator->required()->validate('field')`
✅ **Correct**: `$validator->email()->required()->validate('email')`
✅ **Correct**: Separate validator instance for each form submission
✅ **Correct**: Check `hasErrors()` before processing

❌ **Incorrect**: Creating validator outside `if (POST)` block
❌ **Incorrect**: Not checking for errors before processing
❌ **Incorrect**: Ignoring method chaining (it works, IntelliSense just doesn't show it)

**IntelliSense Issue**: It's a known limitation with method chaining in older PHP code. The validation still **works correctly** - IntelliSense just doesn't show autocomplete for chained methods.
