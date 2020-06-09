const baseUrl = 'http://localhost:3000'
let movieCurrentId = null
$( document ).ready(function() {
    auth()
})

function auth() {
    if(localStorage.token) {
        $('.login-page').hide(1000)
        $('.home-page').show(2000)
        $('.add-form-page').hide(2000)
        $('.update-form-page').hide(2000)
        $('.main-container').show(2000)
        fetchMovies()
    } else {
        $('.login-page').show(1000)
        $('.home-page').hide(500)
        $('.add-form-page').hide(2000)
        $('.update-form-page').hide(2000)
        $('.main-container').hide(2000)
    }
}
function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
    $.ajax({
        method: 'post',
        url: baseUrl + '/users/googleSign',
        data: { id_token }
    })
        .done(({data}) => {
            localStorage.setItem('token', data.token)
            auth()
        })
        .fail(err => {
            console.log(err,'errorrr');
            console.log(err.responseJSON.errors,'errorrrrrrr')
        })
}
  

function logout () {
    localStorage.clear()
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
    auth()
}

function login (event) {
    event.preventDefault()
    let email = $('#email').val()
    let password = $('#password').val()

    $.ajax({
        method: 'post',
        url: baseUrl + '/users/login',
        data: {
            email,
            password
        }
    })
        .done(({data}) => {
            localStorage.setItem('token', data.token)
            auth()
        })
        .fail(err => {
            console.log(err.responseJSON.errors,'errorrrrrrr')
        })
        .always(_=> {
            $('#email').val('')
            $('#password').val('')
        })
    
}

function fetchMovies() {
    $.ajax({
        method: 'get',
        url: baseUrl + '/movies',
        headers: {
            token: localStorage.token
        }
    })
        .done(data => {
            $('.container-home').empty()
            data.movies.forEach(movie => {
                $('.container-home').append(`
                <div class="max-w-sm card rounded overflow-hidden shadow-lg">
                    <i onclick="deleteMovie(${movie.id})" class="fas fa-times delete"></i>
                    <img class="w-full" src="${movie.imageUrl}" alt="Sunset in the mountains">
                    <div class="px-6 py-4">
                      <div class="font-bold text-xl mb-2" style="text-align: center;">${movie.title}</div>
                    </div>
                    <div class="px-6 py-4 card-footer">
                      <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">#${movie.genre}</span>
                      <div class="right-button">
                          <button onclick="toEditForm(${movie.id})">Edit</button>
                      </div>
                    </div>
                </div>
                `)
            });
        })
        .fail(err => {
            console.log(err.responseJSON.errors,'errorrrrrrr')
        })
}

function addMovie (event) {
    event.preventDefault()
    let title = $('#title').val()
    let genre = $('#genre').val()
    let imageUrl = $('#imageUrl').val()
    $.ajax({
        method: 'post',
        url: baseUrl + '/movies',
        headers: {
            token: localStorage.token
        },
        data: { title, genre, imageUrl }
    })
        .done(_ => {
            fetchMovies()
            $('.home-page').show(1500)
            $('.add-form-page').hide(1000)
        })
        .fail(err => {
            console.log(err.responseJSON.errors,'errorrrrrrr')
        })
        .always(_=> {
            $('#title').val('')
            $('#genre').val('')
            $('#imageUrl').val('')
        })
}

function deleteMovie(id) {
    $.ajax({
        method: 'delete',
        url: baseUrl + `/movies/${id}`,
        headers: {
            token: localStorage.token
        }
    })
        .done(_ => {
            fetchMovies()
        })
        .fail(err => {
            console.log(err.responseJSON.errors,'errorrrrrrr')
        })
}

function editMovie (event) {
    event.preventDefault()
    let title = $('#title-edit').val()
    let genre = $('#genre-edit').val()
    let imageUrl = $('#imageUrl-edit').val()
    $.ajax({
        method: 'put',
        url: baseUrl + '/movies/' + movieCurrentId,
        headers: {
            token: localStorage.token
        },
        data: { title, genre, imageUrl }
    })
        .done(_ => {
            fetchMovies()
            $('.home-page').show(1500)
            $('.update-form-page').hide(1000)
        })
        .fail(err => {
            console.log(err.responseJSON.errors,'errorrrrrrr')
        })
        .always(_=> {
            $('#title').val('')
            $('#genre').val('')
            $('#imageUrl').val('')
        })
}

function toAddForm () {
    $('.home-page').hide(1000)
    $('.add-form-page').show(1500)
    $('.update-form-page').hide(1000)
}

function toEditForm (id) {
    movieCurrentId = id
    $.ajax({
        method: 'get',
        url: baseUrl + `/movies/${id}`,
        headers: {
            token: localStorage.token
        }
    })
        .done(data => {
            $('#title-edit').val(`${data.movie.title}`)
            $('#genre-edit').val(`${data.movie.genre}`)
            $('#imageUrl-edit').val(`${data.movie.imageUrl}`)
            $('.home-page').hide(1000)
            $('.add-form-page').hide(1000)
            $('.update-form-page').show(1500)
        })
        .fail(err => {
            console.log(err.responseJSON.errors,'errorrrrrrr')
        })
    
}

function toHome () {
    $('.home-page').show(1500)
    $('.add-form-page').hide(1000)
    $('.update-form-page').hide(1000)
}