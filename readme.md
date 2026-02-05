fitur yang aku tambahkan adalah ada delete, password dan validasi dibagian email dan username ketika username atau email udh exist
lalu ada validasi kalau ga boleh kosong dan juga aku tambahkan profile jadi bisa insert image
untuk apinya itu adalah

http://localhost:3000/api/users/add (bagian create user)
ke bagian body dipostman lalu ke form data karena ada image setelah itu
```
{
    username    
    email
    password
    profilePhoto
}
```
http://localhost:3000/api/users/ (bagian liat semua user)

http://localhost:3000/api/users/1 (bagian liat user by id) dan bisa untuk bagian delete

http://localhost:3000/api/users/update/active (bagian update active usernya)
```
{
    "id": "1",
    "isActive": "true"

    ada validation misalnya id nya ga diinput or isActive etc
}
```
http://localhost:3000/api/users/5/1 (lalu ini bagian untuk liat user tapi cuman dibatasin 5 dan page 1, misal ada 20 user nanti page 1 itu 1-5, page 2 itu 6-10 dan seterusnya)

http://localhost:3000/api/users/login (ini bagian untuk login setelah kalian melakukan add dan untuk bagian login ini cuman mengisi username dan password beserta dummynya):
```
{
    "username": "user 1",
    "password": "alvent1"
}
```
dan udah ada seeder juga dan aku menggunakan mysql
DATABASE_URL="mysql://root:@localhost:3306/TESTING"
JWT_SECRET=supersecretjwt
JWT_EXPIRES_IN=1d
