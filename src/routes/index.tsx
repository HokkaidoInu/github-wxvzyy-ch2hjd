import { Title } from '@solidjs/meta';
import {
  action,
  cache,
  createAsync,
  useAction,
  useSubmission,
} from '@solidjs/router';
import { createComputed, createEffect, createSignal, onMount } from 'solid-js';
import Counter from '~/components/Counter';

const getPerson = cache(async (query: string | undefined) => {
  'use server';

  const response = await fetch(`https://swapi.dev/api/people/${query}`);
  const data = await response.json();
  return data;
}, 'person');

const getNum = cache(async () => {
  'use server';
  const getNumber = async () => {
    return '1';
  };
  const number = await getNumber();
  return number;
}, 'num');

export const route = {
  load: () => {
    getNum();
    getPerson();
  },
};

export default function Home() {
  const num = createAsync(() => getNum(), { deferStream: true });
  num();

  const numResult = num();

  createEffect(() => {
    console.log(numResult);
  });

  const person = createAsync(() => getPerson(numResult), { deferStream: true });
  person();

  createEffect(() => {
    console.log(personSignal());
  });
  const [personSignal, setPersonSignal] = createSignal([]);
  createComputed(() => {
    const content = person();
    if (!content) return;
    setPersonSignal(JSON.parse(JSON.stringify(content)));
  });
  return (
    <main>
      <Title>Hello World</Title>
      <h1>Hello World!</h1>
      <Counter />
      <p>
        Visit{' '}
        <a href="https://start.solidjs.com" target="_blank">
          start.solidjs.com
        </a>{' '}
        to learn how to build SolidStart apps.
      </p>
    </main>
  );
}
