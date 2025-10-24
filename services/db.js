import fs from 'fs/promises';
const filePath = new URL('../data.json', import.meta.url);
export async function getAllUsers() {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading data.json:', err);
        return [];
    }
}
export async function saveUser(newUser) {
    try {
        const data = await getAllUsers();
        // Generate unique id (simple way)
        const id = data.length ? data[data.length - 1].id + 1 : 1;
        const user = { id, ...newUser };
        data.push(user);
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
        return user;
    } catch (err) {
        console.error('Error saving user:', err);
        throw err;
    }
}
export async function getUser(fn) {
    const data = await getAllUsers()
    return data.find(fn)
}

export async function updateUser(id, updatedFields) {

    const data = await getAllUsers();
    const userIndex = data.findIndex(user => user.id === id);
    if (userIndex === -1) {
        throw new Error('User not found');
    }
    data[userIndex] = { ...data[userIndex], ...updatedFields };
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    return data[userIndex];

}









