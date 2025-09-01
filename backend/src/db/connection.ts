import mongoose from 'mongoose';

export default async function connectToDB(mongoUri: string) {
    mongoose.connect(mongoUri as string).then(() => {
        console.log('MongoDB Connected');
    }).catch((err: Error) => {
        console.error(err.message);
        process.exit(1);
    })
};