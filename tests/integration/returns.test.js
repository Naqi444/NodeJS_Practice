const {Rental} = require('../../models/rental');
const mongoose = require('mongoose');
const request = require('supertest');
const {User} = require('../../models/user');
const moment = require('moment');
const {Movie} = require('../../movie');
describe('/api/returns', ()=>{
    let customerId;
    let movieId;
    let rental;
    let token;
    let server;
    let movie;

    let exec =  () =>{
        return request(server)
        .post('/api/returns')
        .set('x-auth-token',token)
        .send({customerId, movieId});
    };
    
    beforeEach(async () => {
            
        server = require('../../index');
        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();
        token = new User().generateAuthToken();

        movie = new Movie({
            _id = movieId,
            title: '12345',
            dailyRentalRate:2,
            genre: {name:'12345'},
            numberInStock:10
        })
        await movie.save(); 
        rental = new Rental({
            customer:{
                _id: customerId,
                name:'12345',
                phone:'12345'
            },
            movie:{
                _id:movieId,
                title:'12345',
                dailyRentalRate: 2
            }
        });
        await rental.save();
    });
    afterEach(async ()=>{
        await server.close();
        await Rental.remove({});
        await Movie.remove({})
    });
    it('should return 401 if the client is not logged in',async ()=>{
       token = '';
        const res = await exec();
       expect(res.status).toBe(401); 
    });

    it('should return 400 if the customer id is not provided',async ()=>{
        customerId = '';
        const res = await exec();
        expect(res.status).toBe(400);
    })

    it('should return 400 if the movie id is not provided',async ()=>{
        movieId = '';
        const res = await exec();
        expect(res.status).toBe(400);
    })

    it('should return 404 if the no rental found ',async ()=>{
        await Rental.remove({}) 
        const res = await exec();
        expect(res.status).toBe(404);
    })

    it('should return 404 if the rental is already processed',async ()=>{ 
        //set return date
        rental.dateReturned = new Date();
        await rental.save();
        const res = await exec();
        expect(res.status).toBe(400);
    })

    it('should return 200 if the rental is valid one',async ()=>{  
        const res = await exec();
        expect(res.status).toBe(200);
    })

    it('should set the returDate if the rental is valid one',async ()=>{  
        const res = await exec();
        const retnalInDb = await Rental.findById(rental._id);
        const diff = new Date() - retnalInDb.dateReturned;
        expect(diff).toBeLessThan(10*1000);
    })

    it('should set the retnalFee if the rental is valid one',async ()=>{  
        rental.dateout = moment().add(-7,'date').toDate();
        await rental.save();
        const res = await exec();
        const retnalInDb = await Rental.findById(rental._id);
        expect(retnalInDb.retnalFee).toBe(14);
    })

    it('should increase the movieStock if the rental is valid one',async ()=>{  
        const res = await exec();
        const movieInDb = await Rental.findById(movieId); 
        expect(movieInDb.numberInStock).toBe(11);
    })

    it('should return the rental if rental is valid one',async ()=>{  
        const res = await exec();
        const retnalInDb = await Rental.findById(rental._id);
        expect(Object.keys(res.body)).toEqual(
            expect.arrayContaining(['dateOut','dateReturned','rentalFee','customer','movie'])
        )
    });
});