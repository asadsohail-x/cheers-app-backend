## API Details 

 BaseURL: http://localhost:8080
## logIn

    URL: /api/user/login  (Post)
    @Access Public
   

    -Request :It need Email(String) and Password(String)
    -Response : And you get success,message token, User-{Order,WishList,_id,FullName,Email,EncryptedPassword,DOB,Address,PhoneNumber,Role,UserId,createdAt,updatedAt   }

## SignUp

    URL: /api/user/signup  (Post)
    @Access Public

    -Request :It need FullName(String), Email(String), Password(String) ,DOB(String), Address(String),       PhoneNumber(String),Role(String) ['admin', 'driver','customer']
    -Response : And you get success,message, User {Order,WishList,_id,FullName,Email,EncryptedPassword,DOB,Address,PhoneNumber,Role,UserId,createdAt,updatedAt   }

## Get Wish List (Specific User)

    URL: /api/user/GetWishList  (Post)
    @Access Private

    -Request :It need Email(String) (Email of a user you want to see wishlist)
    -Response : And you get success,message, WishList['_id','Top','Status','Name','Image','Description','Price',createdAt','createdAt','Category']

## Add Item To WishList (Specific User)

    URL: /api/user/AddItemToWishList  (Post)
    @Access Private

    -Request :It need Email(String),Id(MongoDb Id of Item you want to add in a wishlist for a user)
    -Response : And you get success,message

## Remove Item From Wish List (Specific User)

    URL: /api/user/RemoveItemFromWishList  (Post)
    @Access Private

    -Request :It need Email(String),Id (MongoDb Id of Item you want to add in a wishlist for a user)
    -Response : And you get success,message
 
## Add new Category

    URL: /api/Categories/Add (Post)
    @Access Private

    -Request :It need Name(String),Image(String -name with the full path of image, i.e "upload/Image77898.jpg")
    -Response : And you get success,message,Record{'Item','_id','Name', 'Image','createdAt','updatedAt'}
 
## Get One Category 

    URL: /api/Categories/GetOne (Post)
    @Access Public

    -Request :It need Name(String-name of a category)
    -Response : And you get success,message,data{['Item'],'_id','Name', 'Image','createdAt','updatedAt'}

## Update a Category 

    URL: /api/Categories/Update (Post)
    @Access Private

    -Request :It need Name(String),Image(String-name with the full path of image, i.e "upload/Image77898.jpg")
    -Response : And you get success,message

## Add an item to Category 

    URL: /api/Categories/AddItem (Post)
    @Access Private

    -Request :It need Name(String),Id (MongoDb Id of Item you want to add)
    -Response : And you get success,message

## Remove an item from Category 

    URL: /api/Categories/DeleteItem (Post)
    @Access Private

    -Request :It need Name(String),Id (MongoDb Id of Item you want to add)
    -Response : And you get success,message

## Get All category Record

    URL: /api/Categories/DeleteItem (Get)
    @Access Public

    -Response : And you get success,message,data[['Item'],'_id','Name', 'Image','createdAt','updatedAt']

## Add Item 

    URL: /api/Item/Add (Post)
    @Access Private

    -Request :It need Name(String),Image(String),Description(String),Price(Number),Top(String),Status(String)["Available","OutOfStock"]
    -Response : And you get success,message,Record{'Top','Status','_id','Name','Image','Description','Price','createdAt','updatedAt' }

## Update an Item 

    URL: /api/Item/update (Post)
    @Access Private

    -Request :It need Name(String),Image(String),Description(String),Price(Number),Status(String)["Available","OutOfStock"]
    -Response : And you get success,message

## Get one Item 

    URL: /api/Item/GetOne (Post)
    @Access Public

    -Request :It need Name (name of the item)
    -Response : And you get success,message,Record{'Top','Status','_id','Name','Image','Description','Price','createdAt','updatedAt','Category' }

## Delete an Item 

    URL: /api/Item/Delete (Post)
    @Access Private

    -Request :It need Name(name of the item)
    -Response : And you get success,message

## Get All Item Record

    URL: /api/Item/GetAll (Get)
    @Access Public

    -Response : And you get success,message,Record['Top','Status','_id','Name','Image','Description','Price','createdAt','updatedAt','Category']

## Charge the Stripe Payment

    URL: /api/Payment/Stripe (Post)
    @Access Private

    -Request :It need Email(String),Name(String),Amount(Number),CardNumber(Number),ExpYY(Number),ExpMM(Number),CVV(Number)
    -Response : And you get success,message,charge{Stripe payment Chare Details}

    
## Add Order

    URL: /api/Order/Add (Post)
    @Access Private

    -Request :It need Email(String),TotalPrice(Number),PaymentMethod(String)['Creditcard', 'Cash','Paypal'],Items(Array of mongodbId of items)
    -Response : And you get success,message

    
## Assign Driver / Update Driver

    URL: /api/Order/AssignDriver (Post)
    @Access Private

    -Request :It need Id(mongodb Id of Order),AssignedRider(mongodb Id of AssignedRider)
    -Response : And you get success,message

## Get All Orders (By specific User)

    URL: /api/Order/GetOrdersByUser (Post)
    @Access Private

    -Request :It need Email(String)
    -Response : And you get success,message,data{list of Orders details+User Data}

## Get All Orders (By specific Rider)

    URL: /api/Order/GetOrderByDriver (Post)
    @Access Private

    -Request :It need Email(String)
    -Response : And you get success,message,data{list of Orders details+User Data}

## Get All Orders by Status

    URL: /api/Order/GetOrderByStatus (Post)
    @Access Private

    -Request :It need Status(String)['Pending', 'Approved', 'Delivered']
    -Response : And you get success,message,data{list of Orders}

## Update the Order Status

    URL: /api/Order/UpdateStatus (Post)
    @Access Private

    -Request :It need Id(mongodb Id of Order), Status(String)['Pending', 'Approved', 'Delivered']
    -Response : And you get success,message

## Get All Orders

    URL: /api/Order/GetAll (Get)
    @Access Private
   

    -Response : And you get success,message,data{list of Orders+item details+assigned driver details}


## Image Upload
    URL: /api/Upload/image (Post)
    @Access Pubic

    -Request :It need image(file)
    -Response : And you  get Status, Imagename, Imagepath