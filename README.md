# REST API Toko Retail

## Install

    npm install

## Run the app

    npm run dev

## Deploy in Vercel

    https://be-retail.vercel.app/

## Documentation in swagger

    https://be-retail.vercel.app/docs

# ERD

![Tux, the Linux](/ERD.png)

# REST API

This is a Toko Retail API. It's a simple REST API. You can use it to create, read, update, and delete.

## Create kasir

### Request

`POST /api/v1/auth/register`

    curl -X 'POST' \
      'http://localhost:8080/api/v1/auth/register' \
      -H 'accept: */*' \
      -H 'Content-Type: multipart/form-data' \
      -F 'name=John' \
      -F 'email=john@example.com' \
      -F 'password=secret' \
      -F 'profile_picture=@picture.jpg;type=image/jpeg' \
      -F 'identity_type=KTP' \
      -F 'identity_number=123456789' \
      -F 'address=123 Main Street'

### Response

    {
      "data": {
        "id": 1,
        "name": "John",
        "email": "john@example.com",
        "profile": [
          {
            "profile_picture": "https://ik.imagekit.io/3cdader4/picture.jpg",
            "identity_type": "KTP",
            "identity_number": "123456789",
            "address": "123 Main Street"
          }
        ],
        "createAt": "2024-01-23T12:43:27.731Z",
        "updateAt": "2024-01-23T12:43:27.731Z"
      },
      "message": "success",
      "error": null,
      "status": 200
    }

## Login

### Request

`POST /api/v1/auth/login`

    curl -X 'POST' \
      'http://localhost:8080/api/v1/auth/login' \
      -H 'accept: */*' \
      -H 'Content-Type: application/json' \
      -d '{
      "email": "john@example.com",
      "password": "john12345"
    }'

### Response

    {
      "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ3YWh5dXNhcHV0cmEyMjAzMDBAZ21haWwuY29tIiwiaWF0IjoxNzA2MDE0OTA0fQ.MXScMTA2dYK2vrrVBs9_wqFPAR8f0tY1LLPdYg259NY"
      },
      "message": "success",
      "error": null,
      "status": 200
    }

## Forget password

### Request

`POST /api/v1/auth/forget-password`

    curl -X 'POST' \
      'http://localhost:8080/api/v1/auth/forget-password' \
      -H 'accept: */*' \
      -H 'Content-Type: application/json' \
      -d '{
      "email": "john@example.com"
    }'

### Response

    {
      "data": null,
      "message": "success, please check your email",
      "error": null,
      "status": 200
    }

## Reset password

### Request

`POST /api/v1/auth/reset-password`

    curl -X 'POST' \
      'http://localhost:8080/api/v1/auth/reset-password?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IndhaHl1c2FwdXRyYTIyMDMwMEBnbWFpbC5jb20iLCJpYXQiOjE3MDYwMTU2NTIsImV4cCI6MTcwNjAxOTI1Mn0.jr94oViyArWwq8Qmbc2zJc6uvN2x8GZHSrIHeY8DdM8' \
      -H 'accept: */*' \
      -H 'Content-Type: application/json' \
      -d '{
      "newPassword": "john123"
    }'

### Response

    {
      "data": null,
      "message": "Password reset successfully",
      "error": null,
      "status": 200
    }

## Get kasir

### Request

`GET /api/v1/kasir`

    curl -X 'GET' \
    'http://localhost:8080/api/v1/kasir' \
    -H 'accept: */*' \
    -H 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ3YWh5dXNhcHV0cmEyMjAzMDBAZ21haWwuY29tIiwiaWF0IjoxNzA2MDE0OTA0fQ.MXScMTA2dYK2vrrVBs9_wqFPAR8f0tY1LLPdYg259NY'

### Response

    {
      "data": [
        {
          "id": 1,
          "name": "John",
          "email": "john@example.com",
          "profile": [
            {
              "profile_picture": "https://ik.imagekit.io/3cdader4/picture.jpg",
              "identity_type": "KTP",
              "identity_number": "123456789",
              "address": "123 Main Street"
            }
          ],
          "createAt": "2024-01-23T12:43:27.731Z",
          "updateAt": "2024-01-23T12:43:27.731Z"
        }
      ],
      "message": "success",
      "error": null,
      "status": 200
    }

## Update kasir

### Request

`PUT /api/v1/kasir`

    curl -X 'PUT' \
      'http://localhost:8080/api/v1/kasir' \
      -H 'accept: */*' \
      -H 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ3YWh5dXNhcHV0cmEyMjAzMDBAZ21haWwuY29tIiwiaWF0IjoxNzA2MDE0OTA0fQ.MXScMTA2dYK2vrrVBs9_wqFPAR8f0tY1LLPdYg259NY' \
      -H 'Content-Type: multipart/form-data' \
      -F 'name=' \
      -F 'email=' \
      -F 'password=' \
      -F 'profile_picture=' \
      -F 'identity_type=' \
      -F 'identity_number=987654321' \
      -F 'address='

### Response

    {
      "data": {
        "id": 1,
        "name": "John",
        "email": "john@example.com",
        "profile": [
          {
            "profile_picture": "https://ik.imagekit.io/3cdader4/picture.jpg",
            "identity_type": "KTP",
            "identity_number": "987654321",
            "address": "123 Main Street"
          }
        ],
        "createAt": "2024-01-23T12:43:27.731Z",
        "updateAt": "2024-01-23T12:43:27.731Z"
      },
      "message": "success",
      "error": null,
      "status": 200
    }

## Delete kasir

### Request

`DELETE /api/v1/kasir/:id`

    curl -X 'DELETE' \
      'http://localhost:8080/api/v1/kasir/1' \
      -H 'accept: */*' \
      -H 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ3YWh5dXNhcHV0cmEyMjAzMDBAZ21haWwuY29tIiwiaWF0IjoxNzA2MDE0OTA0fQ.MXScMTA2dYK2vrrVBs9_wqFPAR8f0tY1LLPdYg259NY'

### Response

    {
      "data": {
        "id": 1,
        "name": "John",
        "email": "john@example.com",
        "profile": [
          {
            "profile_picture": "https://ik.imagekit.io/3cdader4/picture.jpg",
            "identity_type": "KTP",
            "identity_number": "987654321",
            "address": "123 Main Street"
          }
        ],
        "deletedAt": "2024-01-23T13:36:12.724Z"
      },
      "message": "delete success",
      "error": null,
      "status": 200
    }

## Create member

### Request

`POST /api/v1/member`

    curl -X 'POST' \
      'http://localhost:8080/api/v1/member' \
      -H 'accept: */*' \
      -H 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ3YWh5dXNhcHV0cmEyMjAzMDBAZ21haWwuY29tIiwiaWF0IjoxNzA2MDE0OTA0fQ.MXScMTA2dYK2vrrVBs9_wqFPAR8f0tY1LLPdYg259NY' \
      -H 'Content-Type: application/json' \
      -d '{
      "name": "andi",
      "identity_type": "KTP",
      "identity_number": "987654321",
      "address": "jakarta barat"
    }'

### Response

    {
      "data": {
        "id": 1,
        "name": "andi",
        "identity_type": "KTP",
        "identity_number": "987654321",
        "address": "jakarta barat",
        "total_point": 0,
        "createAt": "2024-01-24T06:33:31.293Z",
        "updateAt": "2024-01-24T06:33:31.293Z"
      },
      "message": "success",
      "error": null,
      "status": 200
    }

## Get member

### Request

`GET /api/v1/member`

    curl -X 'GET' \
      'http://localhost:8080/api/v1/member' \
      -H 'accept: */*' \
      -H 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ3YWh5dXNhcHV0cmEyMjAzMDBAZ21haWwuY29tIiwiaWF0IjoxNzA2MDE0OTA0fQ.MXScMTA2dYK2vrrVBs9_wqFPAR8f0tY1LLPdYg259NY'

### Response

    {
      "data": {
        "current_page": 1,
        "total_page": 1,
        "total_data": 1,
        "data": [
          {
            "id": 1,
            "name": "andi",
            "identity_type": "KTP",
            "identity_number": "987654321",
            "address": "jakarta barat",
            "total_point": 0,
            "createAt": "2024-01-24T06:33:31.293Z",
            "updateAt": "2024-01-24T06:33:31.293Z"
          }
        ]
      },
      "message": "success",
      "error": null,
      "status": 200
    }

## Update member

### Request

`PUT /api/v1/member/:id`

    curl -X 'PUT' \
      'http://localhost:8080/api/v1/member/1' \
      -H 'accept: */*' \
      -H 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ3YWh5dXNhcHV0cmEyMjAzMDBAZ21haWwuY29tIiwiaWF0IjoxNzA2MDE0OTA0fQ.MXScMTA2dYK2vrrVBs9_wqFPAR8f0tY1LLPdYg259NY' \
      -H 'Content-Type: application/json' \
      -d '{
      "name": "andi prasetyo"
    }'

### Response

    {
      "data": {
        "id": 1,
        "name": "andi prasetyo",
        "identity_type": "KTP",
        "identity_number": "987654321",
        "address": "jakarta barat",
        "total_point": 0,
        "createAt": "2024-01-24T06:33:31.293Z",
        "updateAt": "2024-01-24T06:40:20.701Z"
      },
      "message": "success",
      "error": null,
      "status": 200
    }

## Delete member

### Request

`DELETE /api/v1/member/:id`

    curl -X 'DELETE' \
      'http://localhost:8080/api/v1/member/1' \
      -H 'accept: */*' \
      -H 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ3YWh5dXNhcHV0cmEyMjAzMDBAZ21haWwuY29tIiwiaWF0IjoxNzA2MDE0OTA0fQ.MXScMTA2dYK2vrrVBs9_wqFPAR8f0tY1LLPdYg259NY'

### Response

    {
      "data": {
        "id": 1,
        "name": "andi prasetyo",
        "identity_type": "KTP",
        "identity_number": "987654321",
        "address": "jakarta barat",
        "total_point": 0,
        "deletedAt": "2024-01-24T06:42:52.133Z"
      },
      "message": "delete success",
      "error": null,
      "status": 200
    }

## Insert items

### Request

`POST /api/v1/items`

    curl -X 'POST' \
      'http://localhost:8080/api/v1/items' \
      -H 'accept: */*' \
      -H 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ3YWh5dXNhcHV0cmEyMjAzMDBAZ21haWwuY29tIiwiaWF0IjoxNzA2MDE0OTA0fQ.MXScMTA2dYK2vrrVBs9_wqFPAR8f0tY1LLPdYg259NY' \
      -H 'Content-Type: application/json' \
      -d '{
      "name": "book",
      "price": "5000"
    }'

### Response

    {
      "data": {
        "id": 1,
        "name": "book",
        "price": 5000,
        "createAt": "2024-01-24T06:47:03.278Z",
        "updateAt": "2024-01-24T06:47:03.278Z"
      },
      "message": "success",
      "error": null,
      "status": 200
    }

## Get items

### Request

`GET /api/v1/items`

    curl -X 'GET' \
      'http://localhost:8080/api/v1/items' \
      -H 'accept: */*' \
      -H 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ3YWh5dXNhcHV0cmEyMjAzMDBAZ21haWwuY29tIiwiaWF0IjoxNzA2MDE0OTA0fQ.MXScMTA2dYK2vrrVBs9_wqFPAR8f0tY1LLPdYg259NY'

### Response

    {
      "data": {
        "current_page": 1,
        "total_page": 1,
        "total_data": 1,
        "data": [
          {
            "id": 1,
            "name": "book",
            "price": 5000,
            "createAt": "2024-01-24T06:47:03.278Z",
            "updateAt": "2024-01-24T06:47:03.278Z"
          }
        ]
      },
      "message": "success",
      "error": null,
      "status": 200
    }

## Update items

### Request

`PUT /api/v1/items/:id`

    curl -X 'PUT' \
      'http://localhost:8080/api/v1/items/1' \
      -H 'accept: */*' \
      -H 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ3YWh5dXNhcHV0cmEyMjAzMDBAZ21haWwuY29tIiwiaWF0IjoxNzA2MDE0OTA0fQ.MXScMTA2dYK2vrrVBs9_wqFPAR8f0tY1LLPdYg259NY' \
      -H 'Content-Type: application/json' \
      -d '{
      "price": "6000"
    }'

### Response

    {
      "data": {
        "id": 1,
        "name": "book",
        "price": 6000,
        "createAt": "2024-01-24T06:47:03.278Z",
        "updateAt": "2024-01-24T06:50:55.940Z"
      },
      "message": "success",
      "error": null,
      "status": 200
    }

## Delete items

### Request

`DELETE /api/v1/items/:id`

    curl -X 'DELETE' \
      'http://localhost:8080/api/v1/items/1' \
      -H 'accept: */*' \
      -H 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ3YWh5dXNhcHV0cmEyMjAzMDBAZ21haWwuY29tIiwiaWF0IjoxNzA2MDE0OTA0fQ.MXScMTA2dYK2vrrVBs9_wqFPAR8f0tY1LLPdYg259NY'

### Response

    {
      "data": {
        "id": 1,
        "name": "book",
        "price": 6000,
        "deletedAt": "2024-01-24T06:53:02.540Z"
      },
      "message": "delete success",
      "error": null,
      "status": 200
    }

## Insert Receipt_items

### Request

`POST /api/v1/receipt_items`

    curl -X 'POST' \
      'http://localhost:8080/api/v1/receipt_items' \
      -H 'accept: */*' \
      -H 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ3YWh5dXNhcHV0cmEyMjAzMDBAZ21haWwuY29tIiwiaWF0IjoxNzA2MDE0OTA0fQ.MXScMTA2dYK2vrrVBs9_wqFPAR8f0tY1LLPdYg259NY' \
      -H 'Content-Type: application/json' \
      -d '{
      "item_id": "2",
      "quantity": "2",
      "discount": "0"
    }'

### Response

    {
      "data": {
        "id": 3,
        "items_id": 2,
        "quantity": 2,
        "discount": 0,
        "sub_total_price": 4000,
        "createAt": "2024-01-24T07:01:47.968Z",
        "updateAt": "2024-01-24T07:01:47.968Z"
      },
      "message": "success",
      "error": null,
      "status": 200
    }

## Get all Receipt_items

### Request

`GET /api/v1/receipt_items`

    curl -X 'GET' \
      'http://localhost:8080/api/v1/receipt_items' \
      -H 'accept: */*' \
      -H 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ3YWh5dXNhcHV0cmEyMjAzMDBAZ21haWwuY29tIiwiaWF0IjoxNzA2MDE0OTA0fQ.MXScMTA2dYK2vrrVBs9_wqFPAR8f0tY1LLPdYg259NY'

### Response

    {
      "data": {
        "current_page": 1,
        "total_page": 1,
        "total_data": 3,
        "data": [
          {
            "id": 1,
            "receipt_code": "Trx1",
            "items_id": 1,
            "quantity": 10,
            "discount": 10,
            "sub_total_price": 18000,
            "createAt": "2024-01-19T11:59:30.465Z",
            "updateAt": "2024-01-19T14:27:34.375Z"
          },
          {
            "id": 2,
            "receipt_code": "Trx1",
            "items_id": 2,
            "quantity": 10,
            "discount": 5,
            "sub_total_price": 9500,
            "createAt": "2024-01-19T12:02:07.348Z",
            "updateAt": "2024-01-19T12:02:07.348Z"
          },
          {
            "id": 3,
            "receipt_code": "Trc2",
            "items_id": 2,
            "quantity": 2,
            "discount": 0,
            "sub_total_price": 4000,
            "createAt": "2024-01-24T07:01:47.968Z",
            "updateAt": "2024-01-24T07:01:47.968Z"
          }
        ]
      },
      "message": "success",
      "error": null,
      "status": 200
    }

## Get all Receipt_items (cart)

### Request

`GET /api/v1/receipt_items/cart`

    curl -X 'GET' \
      'http://localhost:8080/api/v1/receipt_items/cart' \
      -H 'accept: */*' \
      -H 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ3YWh5dXNhcHV0cmEyMjAzMDBAZ21haWwuY29tIiwiaWF0IjoxNzA2MDE0OTA0fQ.MXScMTA2dYK2vrrVBs9_wqFPAR8f0tY1LLPdYg259NY'

### Response

    {
      "data": {
        "current_page": 1,
        "total_page": 1,
        "total_data": 1,
        "data": [
          {
            "id": 3,
            "items_id": 2,
            "quantity": 2,
            "discount": 0,
            "sub_total_price": 4000,
            "createAt": "2024-01-24T07:01:47.968Z",
            "updateAt": "2024-01-24T07:01:47.968Z"
          }
        ]
      },
      "message": "success",
      "error": null,
      "status": 200
    }

## Update Receipt_items

### Request

`PUT /api/v1/receipt_items/:id`

    curl -X 'POST' \
      'http://localhost:8080/api/v1/receipt_items' \
      -H 'accept: */*' \
      -H 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ3YWh5dXNhcHV0cmEyMjAzMDBAZ21haWwuY29tIiwiaWF0IjoxNzA2MDE0OTA0fQ.MXScMTA2dYK2vrrVBs9_wqFPAR8f0tY1LLPdYg259NY' \
      -H 'Content-Type: application/json' \
      -d '{
      "item_id": "2",
      "quantity": "2",
      "discount": "0"
    }'

### Response

    {
      "data": {
        "id": 3,
        "items_id": 2,
        "quantity": 2,
        "discount": 0,
        "sub_total_price": 4000,
        "createAt": "2024-01-24T07:01:47.968Z",
        "updateAt": "2024-01-24T07:01:47.968Z"
      },
      "message": "success",
      "error": null,
      "status": 200
    }

## Delete Receipt_items

### Request

`POST /api/v1/receipt_items/:id`

    curl -X 'DELETE' \
      'http://localhost:8080/api/v1/receipt_items/3' \
      -H 'accept: */*' \
      -H 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ3YWh5dXNhcHV0cmEyMjAzMDBAZ21haWwuY29tIiwiaWF0IjoxNzA2MDE0OTA0fQ.MXScMTA2dYK2vrrVBs9_wqFPAR8f0tY1LLPdYg259NY'

### Response

    {
      "data": {
        "id": 3,
        "receipt_code": "Trc2",
        "items_id": 2,
        "quantity": 2,
        "discount": 0,
        "sub_total_price": 4000,
        "deletedAt": "2024-01-24T11:51:00.702Z"
      },
      "message": "delete success",
      "error": null,
      "status": 200
    }

## Insert Receipt

### Request

`POST /api/v1/receipt`

    curl -X 'POST' \
      'http://localhost:8080/api/v1/receipt' \
      -H 'accept: */*' \
      -H 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ3YWh5dXNhcHV0cmEyMjAzMDBAZ21haWwuY29tIiwiaWF0IjoxNzA2MDE0OTA0fQ.MXScMTA2dYK2vrrVBs9_wqFPAR8f0tY1LLPdYg259NY' \
      -H 'Content-Type: application/json' \
      -d '{
      "cash": "100000"
    }'

### Response

    {
      "data": {
        "id": 3,
        "code": "Trx3",
        "total_price": 4000,
        "cash": 100000,
        "cash_refund": 96000,
        "date": "2024-01-24T12:02:16.334Z",
        "point": 10,
        "member_id": null,
        "kasir_id": 2,
        "createAt": "2024-01-24T12:01:36.412Z",
        "updateAt": "2024-01-24T12:02:16.335Z"
      },
      "message": "success",
      "error": null,
      "status": 200
    }

## Get Receipt

### Request

`GET /api/v1/receipt`

    curl -X 'GET' \
      'http://localhost:8080/api/v1/receipt' \
      -H 'accept: */*' \
      -H 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ3YWh5dXNhcHV0cmEyMjAzMDBAZ21haWwuY29tIiwiaWF0IjoxNzA2MDE0OTA0fQ.MXScMTA2dYK2vrrVBs9_wqFPAR8f0tY1LLPdYg259NY'

### Response

    {
      "data": {
        "current_page": 1,
        "total_page": 1,
        "total_data": 2,
        "data": [
          {
            "id": 1,
            "code": "Trx1",
            "total_price": 27500,
            "cash": 100000,
            "cash_refund": 72500,
            "date": "2024-01-20T14:13:07.209Z",
            "point": 20,
            "member_id": 1,
            "kasir_id": 2,
            "createAt": "2024-01-19T11:19:46.671Z",
            "updateAt": "2024-01-20T14:36:42.803Z"
          },
          {
            "id": 3,
            "code": "Trx3",
            "total_price": 4000,
            "cash": 100000,
            "cash_refund": 96000,
            "date": "2024-01-24T12:02:16.334Z",
            "point": 10,
            "member_id": null,
            "kasir_id": 2,
            "createAt": "2024-01-24T12:01:36.412Z",
            "updateAt": "2024-01-24T12:02:16.335Z"
          }
        ]
      },
      "message": "success",
      "error": null,
      "status": 200
    }

## Update Receipt

### Request

`PUT /api/v1/receipt/:id`

    curl -X 'PUT' \
      'http://localhost:8080/api/v1/receipt/3' \
      -H 'accept: */*' \
      -H 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ3YWh5dXNhcHV0cmEyMjAzMDBAZ21haWwuY29tIiwiaWF0IjoxNzA2MDE0OTA0fQ.MXScMTA2dYK2vrrVBs9_wqFPAR8f0tY1LLPdYg259NY' \
      -H 'Content-Type: application/json' \
      -d '{
      "cash": "5000"
    }'

### Response

    {
      "data": {
        "id": 3,
        "code": "Trx3",
        "total_price": 4000,
        "cash": 5000,
        "cash_refund": 1000,
        "date": "2024-01-24T12:02:16.334Z",
        "point": 10,
        "member_id": null,
        "kasir_id": 2,
        "createAt": "2024-01-24T12:01:36.412Z",
        "updateAt": "2024-01-24T12:19:12.793Z"
      },
      "message": "success",
      "error": null,
      "status": 200
    }

## Delete Receipt

### Request

`DELETE /api/v1/receipt/:id`

    curl -X 'DELETE' \
      'http://localhost:8080/api/v1/receipt/3' \
      -H 'accept: */*' \
      -H 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ3YWh5dXNhcHV0cmEyMjAzMDBAZ21haWwuY29tIiwiaWF0IjoxNzA2MDE0OTA0fQ.MXScMTA2dYK2vrrVBs9_wqFPAR8f0tY1LLPdYg259NY'

### Response

    {
      "data": {
        "id": 3,
        "code": "Trx3",
        "total_price": 4000,
        "cash": 5000,
        "cash_refund": 1000,
        "date": "2024-01-24T12:02:16.334Z",
        "point": 10,
        "member_id": null,
        "kasir_id": 2,
        "deletedAt": "2024-01-24T12:20:48.064Z"
      },
      "message": "delete success",
      "error": null,
      "status": 200
    }