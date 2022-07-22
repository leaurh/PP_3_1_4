$(async function () {
    await getUsersTable();
    getNewUserForm();
    getModal();
    addNewUser();
})

const userFetchService = {
    head: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer': null
    },
    findAuthUser: async () => await fetch('api/users/auth_user'),
    findAll: async () => await fetch('api/users'),
    findOneUser: async (id) => await fetch(`api/users/${id}`),
    addNewUser: async (user) => await fetch('api/users', {method: 'POST', headers: userFetchService.head, body: JSON.stringify(user)}),
    updateUser: async (user, id) => await fetch(`api/users/${id}`, {method: 'PUT', headers: userFetchService.head, body: JSON.stringify(user)}),
    deleteUser: async (id) => await fetch(`api/users/${id}`, {method: 'DELETE', headers: userFetchService.head})
}

async function getUsersTable() {
    userFetchService.findAll()
        .then(res => res.json())
        .then(data => renderUsers(data))
}

const renderUsers = (users) => {
    let table = $('#usersTable tbody');
    table.empty();

    users.forEach(user => {
        let userRoles = "";
        console.log(user.roles);
        for(let i = 0; i < user.roles.length; i++) {
            userRoles += user.roles[i].name;
            userRoles += " ";
        }
        let temp = `<tr>
                  <th scope="row">${user.id}</th>
                  <td>${user.email}</td>
                  <td>${user.age}</td>
                  <td>${user.password}</td>
                  <td>${userRoles}</td>     
                  <td><button type="button" class="btn btn-info" data-userid="${user.id}" data-action="edit" data-toggle="modal" data-target="#defaultModal">
                      Edit
                    </button></td>
                <td><button type="button" class="btn btn-danger" data-userid="${user.id}" data-action="delete" data-toggle="modal" data-target="#defaultModal">
                    Delete
                </button></td>
                </tr>`
        table.append(temp)
    })

    $("#usersTable").find('button').on('click', (event) => {
        let defaultModal = $('#defaultModal');
        let targetButton = $(event.target);
        let buttonUserId = targetButton.attr('data-userid');
        let buttonAction = targetButton.attr('data-action');
        defaultModal.attr('data-userid', buttonUserId);
        defaultModal.attr('data-action', buttonAction);
        defaultModal.modal('show');
    })
}

async function getUserPage() {
    let table = $('#userTable tbody');
    table.empty();

    const authUserResponse = await userFetchService.findAuthUser();
    const user = authUserResponse.json();

    user.then(user => {
        let userRoles = "";
        for(let i = 0; i < user.roles.length; i++) {
            userRoles += user.roles[i].name;
            userRoles += " ";
        }
        let temp = `<tr>
              <th scope="row">${user.id}</th>
              <td>${user.email}</td>
              <td>${user.name}</td>
              <td>${user.surName}</td>
              <td>${user.age}</td>
              <td>${user.password}</td>
              <td>${userRoles}</td>`
        table.append(temp)
    })
}

async function getModal() {
    $('#defaultModal').modal({
        keyboard: true,
        backdrop: "static",
        show: false
    }).on("show.bs.modal", (event) => {
        let thisModal = $(event.target);
        let userid = thisModal.attr('data-userid');
        let action = thisModal.attr('data-action');
        switch (action) {
            case 'edit':
                editUser(thisModal, userid);
                break;
            case 'delete':
                deleteUser(thisModal, userid);
                break;
        }
    }).on("hidden.bs.modal", (e) => {
        let thisModal = $(e.target);
        thisModal.find('.modal-title').html('');
        thisModal.find('.modal-body').html('');
        thisModal.find('.modal-footer').html('');
    })
}

async function editUser(modal, id) {
    let preuser = await userFetchService.findOneUser(id);
    let user = preuser.json();
    modal.find('.modal-title').html('Edit user');

    let editButton = `<button  class="btn btn-outline-success" id="editButton">Edit</button>`;
    let closeButton = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`
    modal.find('.modal-footer').append(editButton);
    modal.find('.modal-footer').append(closeButton);

    user.then(user => {
        let bodyForm = `
            <form class="form-group" id="editUser">
                <div class="form-group">
                  <label for="id"><b>ID</b></label>
                  <input type="text" class="form-control" id="id" value="${user.id}" readonly/>
                </div>
                <div class="form-group">
                  <label for="firstName1"><b>Email</b></label>
                  <input type="text" class="form-control" id="firstName1" value="${user.email}" name="email"/>
                </div>
                <div class="form-group">
                  <label for="name1"><b>Name</b></label>
                  <input type="text" class="form-control" id="name1" value="${user.name}" name="firstName"/>
                </div>
                <div class="form-group">
                  <label for="surName1"><b>Surname</b></label>
                  <input type="text" class="form-control" id="surName1" value="${user.surName}" name="surName"/>
                </div>
                <div class="form-group">
                  <label class="form-label" for="age1"><b>Age</b></label>
                  <input type="number" id="age1" class="form-control" value="${user.age}" name="age"/>
                </div>
                <div class="form-group">
                  <label for="password1"><b>Password</b></label>
                  <input type="password" class="form-control" id="password1" value="${user.password}" name="password"/>
                </div>
                <div class="form-group">
                  <label for="role1"><b>Role</b></label>
                  <select size="2" multiple class="form-control" id="role1">
                    <option value="ROLE_USER">ROLE_USER</option>
                    <option value="ROLE_ADMIN">ROLE_ADMIN</option>
                 </select>
                </div>
                </form>`
        modal.find('.modal-body').append(bodyForm);
    })

    $("#editButton").on('click', async () => {
        let id = modal.find("#id").val().trim();
        let email = modal.find("#firstName1").val().trim();
        let name = modal.find("#name1").val().trim();
        let surName = modal.find("#surName1").val().trim();
        let age = modal.find("#age1").val().trim();
        let password = modal.find("#password1").val().trim();
        let roles = modal.find("#role1").val();
        let data = {
            id: id,
            email: email,
            name: name,
            surName: surName,
            age: age,
            password: password,
            roles: roles
        }
        const response = await userFetchService.updateUser(data, id).catch(error => console.log(error));

        if (response.ok) {
            getUsersTable();
            modal.modal('hide');
        } else {
            let body = await response.json();
            let alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="sharaBaraMessageError">
                            ${body.info}
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`;
            modal.find('.modal-body').prepend(alert);
        }
    })
}

async function deleteUser(modal, id) {
    let preuser = await userFetchService.findOneUser(id);
    let user = preuser.json();
    modal.find('.modal-title').html('Delete user');

    let deleteButton = `<button  class="btn btn-danger" id="deleteButton">Delete</button>`;
    let closeButton = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`
    modal.find('.modal-footer').append(deleteButton);
    modal.find('.modal-footer').append(closeButton);

    user.then(user => {
        let bodyForm = `
            <form class="form-group" id="deleteUser">
                <div class="form-group">
                  <label for="id"><b>ID</b></label>
                  <input type="text" class="form-control" id="id" value="${user.id}" readonly/>
                </div>
                <div class="form-group">
                  <label for="firstName1"><b>Email</b></label>
                  <input type="text" class="form-control" id="firstName1" value="${user.email}" name="firstName" readonly/>
                </div>
                <div class="form-group">
                  <label for="name1"><b>Name</b></label>
                  <input type="text" class="form-control" id="name1" value="${user.name}" name="name" readonly/>
                </div>
                <div class="form-group">
                  <label for="surName1"><b>Surname</b></label>
                  <input type="text" class="form-control" id="surName1" value="${user.surName}" name="surName" readonly/>
                </div>
                <div class="form-group">
                  <label class="form-label" for="age1"><b>Age</b></label>
                  <input type="number" id="age1" class="form-control" value="${user.age}" name="age" readonly/>
                </div>
                <div class="form-group">
                  <label for="password1"><b>Password</b></label>
                  <input type="password" class="form-control" id="password1" value"${user.password}" name="password" readonly/>
                </div>
                <div class="form-group">
                  <label for="role1"><b>Role</b></label>
                  <select size="2" multiple class="form-control" id="role1" readonly>
                    <option value="ROLE_USER">ROLE_USER</option>
                    <option value="ROLE_ADMIN">ROLE_ADMIN</option>
                </select>
                </div>
                </form>`
        modal.find('.modal-body').append(bodyForm);
    })


    $("#deleteButton").on('click', async () => {
        const response = await userFetchService.deleteUser(id).catch(error => console.log(error));

        if (response.ok) {
            getUsersTable();
            modal.modal('hide');
        } else {
            let body = await response.json();
            let alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="sharaBaraMessageError">
                            ${body.info}
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`;
            modal.find('.modal-body').prepend(alert);
        }
    })
}

async function addNewUser() {
    let addUserForm = $('#addUserForm');
    let email = addUserForm.find("#firstNameAdd").val().trim();
    let name = addUserForm.find("#nameAdd").val().trim();
    let surName = addUserForm.find("#surNameAdd").val().trim();
    let age = addUserForm.find("#ageAdd").val().trim();
    let password = addUserForm.find("#passwordAdd").val().trim();
    let roles = addUserForm.find("#roleAdd").val();
    let data = {
        email: email,
        name: name,
        surName: surName,
        age: age,
        password: password,
        roles: roles
    }
    const response = await userFetchService.addNewUser(data);

    if (response.ok) {
        getUsersTable();

    } else {
        let body = await response.json();
        let alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="sharaBaraMessageError">
                        ${body.info}
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>`;
        addUserForm.prepend(alert)
    }
}

getUsersTable()
getModal()
$("#addUserButton").on('click', async () => {
    addNewUser()
})
$("#list-profile-list").on('click', async () => {
    getUserPage()
})