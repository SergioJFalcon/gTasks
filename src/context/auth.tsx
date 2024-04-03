/* eslint-disable no-unused-vars */
import Spinner from "@src/components/spinner";
import { getChromeAuthToken } from "@src/pages/background";
import { createContext, createSignal, onMount, Show, useContext } from "solid-js";
import { createStore, unwrap, produce, StoreSetter } from "solid-js/store";




interface AuthState {
  isLoading: boolean,
  isAuthenticated: boolean,
  token: string,
  activeListId: string,
  activeListTitle: string
}

interface AuthMethods {
  setToken: (token: string) => string,
  setListId: (listId: string) => string,
  setListTitle: (listTitle: string) => string
}

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
  token: "",
  activeListId: "",
  activeListTitle: "",
};

const initialMethods = {
  setToken: (token: string) => "",
  setListId: (listId: string) => "",
  setListTitle: (listTitle: string) => ""
}

const AuthStateContext = createContext<AuthState>(initialState);
const AuthDispatchContext = createContext<AuthMethods>(initialMethods);

export default function AuthProvider(props: { children: any; }) {
  const [store, setStore] = createStore(initialState);
  const [methods, setMethods] = createStore(initialMethods);

  const displayStore = (store: AuthState) => {
    const storeObj = unwrap(store);
    console.log("displayStore: ", storeObj);
    return storeObj;
  }

  
  const authenticate = async () => {
    try {
      console.log("authenticate: ");
      await getChromeAuthToken().then((res: any) => {
        setStore("token", res);
        setStore("isAuthenticated", true);
      });
      displayStore(store)
      console.log('authenticate: done');
    } catch (error) {
      console.log("authenticate error: ", error);
      setStore("isAuthenticated", false);
      displayStore(store)
    }
  };

  const setToken = (token: string) => {
    setStore("token", token);
    return store.token;
  };

  const setListId = (listId: string) => {
    setStore("activeListId", listId);
    return store.activeListId;
  };

  const setListTitle = (listTitle: string) => {
    setStore("activeListTitle", listTitle);
    return store.activeListTitle;
  };

  onMount(async () => {
    setStore("isLoading", true);
    setMethods({
      setToken,
      setListId,
      setListTitle
    })
    await authenticate();
    displayStore(store)
    setStore("isLoading", false);
  });

  return (
    <AuthStateContext.Provider value={store}>
      <AuthDispatchContext.Provider value={methods}>
        <Show when={!store.isLoading} fallback={<Spinner />}>
          {props.children}
        </Show>
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
}

export const UseAuthState = () => useContext(AuthStateContext);
export const UseAuthDispatch = () => useContext(AuthDispatchContext);
