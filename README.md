![indubitably](https://i.imgur.com/KM7mZQo.png)

Simple, functional JSON schema validator that leaves no room for doubt.

# Example

Given the schema:
```js
const movie_schema = {                      // hash type
  name:     string,                          // any string
  year:     integer((y) => y > 1800),        // custom validators
  type:     string("color", "black&white"),  // value ranges
  rating:   decimal,
  
  releases: [             // array type
    {                     // nested validations
      country: string,
      date:    date
    }
  ],

  reviews: [
    or(                        // operators for variant types
      {
        type:    "user",       // strict value validation
        content: string
      },
      {
        type:    "critic",
        content: string,
        source:  string(isURL) // composable validations with custom functions
      }
    )
  ],

  'poster?': string,  // optional keys with '?'

  ':extra':  any      // additional keys with any type
};
```

and the received data:
```js
const movie_data = {
  name:    "Matrix",                        
  year:    "1999",    // gets validated as and converted to int    
  type:    "color",  
  rating:  "8.7",     // gets validated as and converted to decimal
  
  releases: [             
    {                     
      country: "USA",
      date:    "1999-03-31", // iso8601
      nonsense: 3.3333       // no matching wildcards, discarded
    }
  ],

  reviews: [                                        
    {
      type:    "user",        // matches "user" variant
      content: "gooood..."
    },
    {
      type:    "user",          
      content: "not goood..." // matches "user" variant
    },
    {
      type:    "critic",      // matches "critic" variant
      content: "meehh",
      source:  "http://example.com/matrix_critic" 
    }
  ],

  poster: "http://example.com/matrix_poster.png",  

  answer: 42
};
```

running the validator with input and schema:
```js
validator(movie_data, movie_schema);
```

gives you:
```js
{
  name:    "Matrix",                        
  year:    1999,    // gets validated as and converted to int    
  type:    "color",  
  rating:  8.7,     // gets validated as and converted to decimal
  
  releases: [             
    {                     
      country: "USA",
      date:    Moment
    }
  ],

  reviews: [                                        
    {
      type:    "user",        
      content: "gooood..."
    },
    {
      type:    "user",          
      content: "not goood..." 
    },
    {
      type:    "critic",
      content: "meehh",
      source:  "http://example.com/matrix_critic" 
    }
  ],

  poster: "http://example.com/matrix_poster.png",  

  answer: 42
}
```

