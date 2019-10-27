<script src="main.js"></script>
<link rel="stylesheet" href="mq.scss">
<template>
  <div id="app">

    <nav class="navbar navbar-expand-lg navbar-light">
      <div class="container">
        <router-link to="/" class="navbar-brand">LOGO</router-link>
        <button
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarTogglerDemo02"
          aria-controls="navbarTogglerDemo02"
          aria-expanded="false"
          aria-label="Toggle navigation"

          v-on:click="toggleNav" v-bind:class="{ 'show': isActive }"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarTogglerDemo02" v-bind:class="{ 'show': isActive }">
          <ul class="navbar-nav ml-auto mt-2 mt-lg-0">
            <li class="nav-item">
              <router-link to="/" class="nav-link">Home</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/" class="nav-link">Features</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/" class="nav-link">About</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/faq" class="nav-link">FAQ</router-link>
            </li>
            <li class="nav-item">
              <button class="btn btn-outline-success m-2 my-sm-0" type="submit">
                <i class="fas fa-download"></i> Join Now
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <router-view/>

    <footer>
      <div class="container">
        <div class="row">
          <div class="col-md-6 left order-2">
            <div class="wrapper">
              <i class="fa fa-copyright"></i> Copyright 2019.
            </div>
          </div>
          <div class="col-md-6 right order-1">
            <div class="wrapper">
              <a href="https://fb.com">
                <i class="fab fa-facebook-square"></i>
              </a>
              <a href="https://twitter.com">
                <i class="fab fa-twitter-square"></i>
              </a>
              <a href="https://youtube.com">
                <i class="fab fa-youtube"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>

  </div>
</template>

<script>
  // import "../node_modules/jquery/dist/jquery.min.js";
  // import "../node_modules/bootstrap/dist/js/bootstrap.min.js";

  export default {
    name: "app",
    data: function () {
      return {
        isActive: false
      }
    },
    methods: {
      toggleNav: function () {
        this.isActive = !this.isActive;
      }
    }
  };
</script>

<style lang="scss">
  @import url('https://fonts.googleapis.com/css?family=Roboto+Slab:300,400,700|Roboto:300,400,500,700');
  @import "../node_modules/bootstrap/scss/bootstrap.scss";
  @import "mq";

  %a {
    font-family: "Roboto", sans-serif;
    font-family: "Roboto Slab", serif;
  }

  #app {

    .navbar {
      background: $c1;
      font-weight: bold;

      .navbar-brand {
        font-family: "Roboto Slab", serif;
        font-weight: 700;
        letter-spacing: 3px;
        font-size: 25px;
        color: $c3;
      }

      .navbar-toggler {
        .navbar-toggler-icon {
          color: $c3;
        }
      }

      .navbar-nav {
        .nav-item {

          margin: 0px 10px;

          .nav-link {
            color: $c3;
            font-family: "Roboto", sans-serif;
            font-weight: 300;
            font-size: 15px;
          }

          button[type=submit] {
            color: $c3;
            border-color: $c2;

            &:hover {
              background: $c2;
            }
          }
        }
      }


    }

    footer {
      background: $c1;
      color: $c3;
      height: 10vh;
      display: flex;
      align-items: center;
      color: $c3;
      font-family: "Roboto", sans-serif;
      font-weight: 300;
      font-size: 15px;

      a {
        color: $c3;

        &:hover {
          color: darken($c3, 50%);
        }
      }

      .left {
        .wrapper {

        }
      }

      .right {
        .wrapper {
          display: inline-block;
          display: flex;
          justify-content: flex-end;

          i {
            font-size: 20px;
            margin: 0px 10px;
          }
        }
      }

    }
  }
</style>
