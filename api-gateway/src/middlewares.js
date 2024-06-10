const  axios =  require('axios')
const AUTH_SERVICE = process.env.AUTH_SERVICE_URL

const auth = async (req, res, next) => {
	// console.log(` Targeted Log : ${req.headers.authorization}`)
	if (!req.headers['authorization']) {
		return res.status(401).json({ message: 'Unauthorized 1' });
	}

	try {
		// console.log("Hi from Tyr Block")
		const token = req.headers['authorization']?.split(' ')[1];
		const { data } = await axios.post(
			`${AUTH_SERVICE}/auth/verify-token`,
			{
				accessToken: token,
				headers: {
					ip: req.ip,
					'user-agent': req.headers['user-agent'],
				},
			}
		);
		// console.log(data)
		if(data){
			req.headers['x-user-id'] = data.user.id;
			req.headers['x-user-email'] = data.user.email;
			req.headers['x-user-name'] = data.user.name;
			req.headers['x-user-role'] = data.user.role_name;

			next();
		}
	} catch (error) {
		console.log('[auth middleware]', error);
		return res.status(401).json({ message: 'Unauthorized 2' });
	}
};

const isTeacher = (req, res, next)=>{
	const role  = req.headers['x-user-role']
	if(role == "Teacher"){
		next()
	}
	else{
		console.log(`role From req.headers ${role}`)
		return res.status(401).json({ message: 'Unauthorized Access' });
	}
}

const isAdmin = (req, res, next)=>{
	const role  = req.headers['x-user-role']
	if(role == "Admin"){
		next()
	}
	else{
		console.log(`role From req.headers ${role}`)
		return res.status(401).json({ message: 'Unauthorized Access' });
	}
}

const isStudent = (req, res, next)=>{
	const role  = req.headers['x-user-role']
	if(role == "Student"){
		next()
	}
	else{
		console.log(`role From req.headers ${role}`)
		return res.status(401).json({ message: 'Unauthorized Access' });
	}
}

const Setup = (req, res, next)=>{
	console.log(`Hello from Setup Route`)
	// Need to Apply RabbitMQ Here for synchronus Communications such as to hit /setup of every services
	// here we can check user service to get some data if data, alreay setup, else do setup 
	
	
	// const role  = req.headers['x-user-role']
	// if(role == "Admin"){
	// 	next()
	// }
	// else{
	// 	console.log(`role From req.headers ${role}`)
	// 	return res.status(401).json({ message: 'Unauthorized Access' });
	// }
}

const middlewares = { auth, isAdmin, isTeacher, isStudent,Setup };
module.exports = middlewares;