//POST /api/returns {customerID, movieID}


// Return 401 if client is not logged in
// Return 400 if customerId is not provided
// Return 400 if movieId is not provided
// Return 404 if no rental found for this customer/movie
// Return 400 is rental already processed
// Return 200 if valid request
// Set the return data
// Calculate the rental fee
// Increase the stock
// Return the rental 
