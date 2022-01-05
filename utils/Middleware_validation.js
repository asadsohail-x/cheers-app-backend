const { check, validationResult } = require('express-validator');

exports.validationFunction = async (req, res, next) => {
	const errors = validationResult(req);
	errors.type = 'expressValidationError';
	if (!errors.isEmpty()) {
		return res.status(500).json(errors.array());
	}
	next();
};
/******User ******/
//signLSignUp
exports.SignupValidation = [
	check('FullName')
		.notEmpty()
		.withMessage("Must Enter UserName"),
	check('Email')
		.notEmpty()
		.withMessage("Must Enter Email")
		.isEmail()
		.withMessage("Enter Valid Email"),
	check('Password')
		.notEmpty()
		.withMessage("Must Enter Password")
		.isLength({ min: 8 })
		.withMessage("Password must be greater than 8 characters"),
	check('DOB')
		.notEmpty()
		.withMessage("Must Enter Date Of Birth"),
	check('Address')
		.notEmpty()
		.withMessage("Must Enter Address"),
	check('PhoneNumber')
		.notEmpty()
		.withMessage("Must Enter Phone Number ")
];
//signLogin
exports.LoginValidation = [
	check('Email')
	    .notEmpty()
		.withMessage("Must Enter Email")
		.isEmail()
		.withMessage("Enter Valid Email"),
	check('Password')
		.notEmpty()
		.withMessage("Must Enter Password")
		.isLength({ min: 8 })
		.withMessage("Password must be greater than 8 characters"),
];
//StripeValidation
exports.StripeValidation = [
	check('Email')
		.notEmpty()
		.withMessage("Must Enter Email"),
	check('Name')
		.notEmpty()
		.withMessage("Must Enter Name"),
	check('Amount')
		.notEmpty()
		.withMessage("Must Enter Charge Amount"),
	check('CardNumber')
		.notEmpty()
		.withMessage("Must Enter CardNumber"),
	check('ExpYY')
		.notEmpty()
		.withMessage("Must Enter Expiry year"),
	check('ExpMM')
		.notEmpty()
		.withMessage("Must Enter Expiry Month"),
	check('CVV')
		.notEmpty()
		.withMessage("Must Enter CVV code"),

];

//StripeValidation
exports.CardValidation = [
	check('Email')
		.notEmpty()
		.withMessage("Must Enter Email"),
	check('FirstName')
		.notEmpty()
		.withMessage("Must Enter First Name"),
	check('LastName')
		.notEmpty()
		.withMessage("Must Enter Last Name"),
	check('CardNumber')
		.notEmpty()
		.withMessage("Must Enter CardNumber"),
	check('DateYY')
		.notEmpty()
		.withMessage("Must Enter Expiry year"),
	check('DateMM')
		.notEmpty()
		.withMessage("Must Enter Expiry Month"),
	check('CVV')
		.notEmpty()
		.withMessage("Must Enter CVV code"),

];