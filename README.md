## SOCIAL MEDIA API

  - WORK IN PROGRESS

# USER
  - DONE

  - `/api/register` (POST) => Create user
    - DONE
  - `/api/login` (POST) => Sign-in user
    - DONE
  - `/api/users` (GET) => Get all users
    - DONE
  - `/api/users/:username` (GET) => Get User Public Data
    - DONE
  - `/api/users/:username/password` (PATCH) => (need jwt) Update user password
    - DONE
  - `/api/users/:username/profile` (PATCH) => (need jwt) Update user data
    - DONE
  - `/api/users/:username` (DELETE) => (need jwt) Delete user
    - DONE
  - `/api/users/:username/follow` (POST) => Follow other user
    - DONE
  - `/api/users/:username/followers` (GET) => Get all user followers data
    - DONE
  - `/api/users/:username/unfollow` (DELETE) => Unfollow other user
    - DONE
  - `/api/users/:username/block` (POST): Block other user
    - DONE
  - `/api/users/:username/block` (GET) => Get user blocked
    - DONE
  - `/api/users/:username/unblock` (DELETE) => Unblock User
    - DONE
  - `/api/users/:username/report` (POST): Report other user
    - DONE

# POST
  - DONE

  - `/api/posts` (POST) => Create post
    - DONE
  - `/api/posts` (GET) => Get posts (limit of posts received)
    - DONE
  - `/api/posts/:postID` (GET) => Get specific post
    - DONE
  - `/api/posts/:postID` (PATCH) => (need jwt) Edit post
    - DONE
  - `/api/posts/:postID` (DELETE) => (need jwt) Delete post
    - DONE
  - `/api/posts/:postID/like` (POST) => Send a like to post (limit of one per user)
    - DONE
  - `/api/posts/:postID/repost` (POST) => Repost on user account (post only can be reposted once by each user)
    - DONE
  - `/api/posts/:postID/report` (POST) => Report post
    - DONE

# COMMENTS

  - `/api/posts/:postID/comments` (POST) => Create a comment on the post
    - DONE
  - `/api/posts/:postID/comments` (GET) => Get post comments
    - DONE

# SEARCH

  - `/api/search/users` (GET) => Search users
    - DONE
  - `/api/search/posts` (GET) => Search posts
    - DONE
    