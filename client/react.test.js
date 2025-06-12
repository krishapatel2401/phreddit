import {render, screen, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import Header from './src/components/header';

describe('React: Create Post button in Header', ()=>{
    const mockHandleCreatePostClick = jest.fn(); //mocking the button click handler

    test('Button is disabled for guests (no active user)', () =>{
        render(
            <Header
                activeUser={null}
                activeView={'home'}
                setActiveUser={jest.fn()}
                setActiveView={jest.fn()}
                setActiveCommunity={jest.fn()}
                searchQuery=''
                setSearchQuery={jest.fn()}
                setSearchResults={jest.fn()}
                posts={[]}
                comments={[]}
            />
        );
        const button = screen.getByRole('button', {name: /Create Post.../i});
        expect(button).toBeDisabled();
        
    });

    test('Button is enabled for logged-in users', () =>{
        render(
            <Header
                activeUser={
                    {email:'catlady13@gmail.com',
                    displayName: 'catlady13'}
                }
                activeView={'home'}
                setActiveUser={jest.fn()}
                setActiveView={jest.fn()}
                setActiveCommunity={jest.fn()}
                searchQuery=''
                setSearchQuery={jest.fn()}
                setSearchResults={jest.fn()}
                posts={[]}
                comments={[]}
            />
        );
        const button = screen.getByRole('button', {name: /Create Post.../i});
        expect(button).toBeEnabled();
        
    });
});