class APIFeatures {
    constructor(query, queryString) {
        this.query = query;   // means => Product.find({})
        this.queryString = queryString;

    };

    filter() {
        const queryObj = { ...this.queryString };

        const excludedFields = ['sort', 'page', 'limit', 'fields'];

        excludedFields.forEach(field => delete queryObj[field]);

        let queryStr = JSON.stringify(queryObj);

        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);

        this.query = this.query.find(JSON.parse(queryStr)) // means => this.Product = this.Product.find(queryObj)

        return this;
    };

    sort() {
        if (this.queryString.sort) {

            const sortBy = this.queryString.sort.split(',').join(' ');

            this.query = this.query.sort(sortBy);

        } else {
            this.query = this.query.sort('-createdAt');
        }
        return this
    }

    limitFields() {
        if (this.queryString.fields) {

            const fields = this.queryString.fields.split(',').join(' ')

            this.query = this.query.select(fields);     // => this.Product = this.Product.select({title description })
        }
        return this
    }

    paginate() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit || 10;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);

        return this
    };
};


module.exports = APIFeatures;