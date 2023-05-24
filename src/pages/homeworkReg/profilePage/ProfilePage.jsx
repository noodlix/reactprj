import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import Posts from "../../../components/homeworkReg/posts/Posts";

import { signOut } from "../../../store/userSlice";
import { getPosts } from "../../../store/postsSlice";

import ProfileRouter from "../../../components/homeworkReg/profileRouter";

import s from "./ProfilePage.module.scss";

const ProfilePage = () => {
  const {user} = useSelector(state => state.user)
  const {posts} = useSelector(state => state.posts)

  const [myPosts, setMyPosts] = useState([]);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(3);

  const lastIndex = currentPage * postsPerPage;
  const firstIndex = lastIndex - postsPerPage;
  const currentPosts = myPosts.slice(firstIndex, lastIndex);

  const disabledNext = Math.ceil(myPosts.length / 3) > currentPage;
  const disabledPrev = currentPage > 1;

  const [havePosts, setHavePosts] = useState(false);

  const dispatch = useDispatch();

  const prevPage = () => setCurrentPage(prev => prev - 1);
  const nextPage = () => setCurrentPage(prev => prev + 1);

  useEffect(() => {
    posts.find((post) => {
      if (Number(post.user) === Number(user.id)) {
        setHavePosts(true);
      }
    });
  }, [posts, user.id])

  const signOutFunc = () => {
    dispatch(signOut());
  };

  useEffect(() => {
    dispatch(getPosts());
  }, [dispatch]);

  useEffect(() => {
    let yourPosts = posts.map(post => {
      if (Number(post.user) === Number(user.id)) {
        return post
      } 
    });
    yourPosts = yourPosts.filter(post => post);
    setMyPosts(yourPosts);
  }, [posts, user.id]);
  
  return (
    <>
      <ProfileRouter />
      <div className={s.user}>
        <div className={s.profile}>
          <div className={s.profile__info}>
            <div className={s.profile__bio}>
              <div className={s.profile__avatar}>
                  <img src={user.avatar} alt="avatar" className={s.avatar} />
              </div>
              <div className={s.profile__personalData}>
                <div className={s.profile__name}>
                  {user.name ? user.name : <h3>you don't have a nickname</h3>}
                </div>
                <div className={s.profile__email}>Hello! {user.email}</div>
                <div className={s.profile__description}>{user.description}</div>
              </div>
            </div>
            <div className={s.profile__buttons}>
              <Link to="/settings" className={`${s.btn} ${s.settings}`}>
                Settings
              </Link>
              <button onClick={signOutFunc} className={`${s.btn} ${s.out}`}>
                Sign out
              </button>
            </div>
          </div>
          {
            havePosts && (
            <>
              <Posts posts={currentPosts} />
              <div className={s.profile__pagination}>
                <button className={s.profile__pagination_button} style={{opacity: !disabledPrev ? 0.4: 1}} onClick={prevPage} disabled={!disabledPrev}>Prev</button>
                <button className={s.profile__pagination_button} style={{opacity: !disabledNext ? 0.4: 1}} onClick={nextPage} disabled={!disabledNext}>Next</button>
              </div>
            </>
            )}
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
