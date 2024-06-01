const EXAM_SERVICE =	process.env.EXAM_SERVICE_URL || 'http://host.docker.internal:4004';
const QUESTION_SERVICE =	process.env.QUESTION_SERVICE_URL || 'http://host.docker.internal:4005';

module.exports = {EXAM_SERVICE,QUESTION_SERVICE}
