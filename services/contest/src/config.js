const CONTEST_SERVICE =	process.env.CONTEST_SERVICE_URL || 'http://host.docker.internal:4004';
const QUESTION_SERVICE =	process.env.QUESTION_SERVICE_URL || 'http://host.docker.internal:4005';

module.exports = {CONTEST_SERVICE,QUESTION_SERVICE}
