export function verifyAge(req, res, next) {
  const submittedAge = req.params?.age ?? req.body?.age;
  const age = Number(submittedAge);

  if (
    submittedAge === undefined ||
    submittedAge === null ||
    submittedAge === '' ||
    typeof submittedAge === 'boolean' ||
    !Number.isInteger(age) ||
    age < 0
  ) {
    return res.status(400).json({
      message: 'Age must be a valid whole number.'
    });
  }

  if (age < 18) {
    return res.status(403).json({
      message: 'You must be at least 18 years old to register.'
    });
  }

  req.verifiedAge = age;

  if (req.body) {
    req.body.age = age;
  }

  return next();
}
