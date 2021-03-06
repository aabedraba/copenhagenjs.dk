import admin from "firebase-admin";
import { FirebaseResult, FirebaseResultItem, db } from "../services/firebase";

export type User = {
  id?: string;
  email?: string;
  username?: string;
  name?: string;
  image?: string;
  githubId?: string;
  twitterId?: string;
  instagramId?: string;
  website?: string;
  favorites?: string[];
  created?: string;
};

export async function getUser(
  userId
): Promise<FirebaseResultItem<User> & admin.firestore.DocumentSnapshot> {
  const doc = await db
    .collection("users")
    .doc(userId)
    .get();
  return doc;
}

export async function getUsers(): Promise<
  admin.firestore.QueryDocumentSnapshot[]
> {
  const doc = await db.collection("users").get();
  return doc.docs;
}

export async function searchUser(
  key,
  value
): Promise<admin.firestore.QuerySnapshot> {
  const usersCol = db.collection("users");
  const results = await usersCol.where(key, "==", value).get();
  return results;
}

export async function searchGhostUser(
  key,
  value
): Promise<admin.firestore.QuerySnapshot> {
  const usersCol = db.collection("ghostusers");
  const results = await usersCol.where(key, "==", value).get();
  return results;
}

export async function updateUser(userId, data) {
  const doc = db.collection("users").doc(userId);
  const update = await doc.set(data, { merge: true });
  return update;
}

export async function getUserEmail(userId) {
  const user = await admin.auth().getUser(userId);
  return user.email;
}

export async function getAuthUser(userId: string) {
  const user = await admin.auth().getUser(userId);
  return user;
}

export async function getUsersFull(): Promise<User[]> {
  const users = await getUsers();
  const usersMeta = users.map(
    async (user): Promise<User> => {
      const data: User = user.data();
      const authUser = await getAuthUser(user.id);
      return {
        id: user.id,
        created: authUser.metadata.creationTime,
        email: authUser.email,
        ...data
      };
    }
  );
  const transformed = await Promise.all(usersMeta);
  return transformed;
}

export async function getUserFull(username: String): Promise<User | null> {
  const searchResult = await searchUser("username", username);
  if (searchResult.size === 0) return null;
  const userResult = searchResult.docs[0];
  const data: User = userResult.data();
  const authUser = await getAuthUser(userResult.id);

  return {
    id: userResult.id,
    created: authUser.metadata.creationTime,
    email: authUser.email,
    ...data
  };
}
