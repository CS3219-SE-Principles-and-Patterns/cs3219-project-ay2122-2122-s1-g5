const JWT_ERROR = (err) => "JWT check failed: " + err;
const JWT_AUTH_FAILED = "you are not authenticated!";

module.exports = {
	JWT_ERROR,
	JWT_AUTH_FAILED
};
