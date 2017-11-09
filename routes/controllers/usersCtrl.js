import users from './json/users.json';

const getUsers = (req, res) => {
    if (!users) {
        res.status(404).json({ error: 'Users not found' });
        return;
    }

    res.type('json');
    res.status(200).json({ users });
};

export default getUsers;