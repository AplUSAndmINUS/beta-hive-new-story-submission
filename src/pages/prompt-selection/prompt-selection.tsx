import React from 'react';

import NavigateButtons from 'src/components/navigate-buttons/navigate-buttons';
import PromptCard from 'src/components/prompt-card/prompt-card';
import Selections from 'src/components/selections/selections';
import { useAppDispatch, useAppSelector } from 'src/stores/store';
import { setPrompts } from 'src/stores/reducers/story-submission';
import { fetchAdminData } from 'src/stores/middleware/admin-thunks';

export const PromptSelection: React.FC = () => {
  const dispatch = useAppDispatch();
  const { prompts: selectedPrompts } = useAppSelector(
    (state) => state.storySubmission
  );
  const { minPromptSelections, prompts } = useAppSelector(
    (state) => state.adminSubmission
  );

  React.useEffect(() => {
    if (!prompts || prompts.length === 0) {
      dispatch(fetchAdminData());
    }
  }, [dispatch, prompts]);

  const handlePromptSelection = (selection: string) => {
    if (selectedPrompts.includes(selection)) {
      // Remove prompt if already selected
      dispatch(
        setPrompts(selectedPrompts.filter((prompt) => prompt !== selection))
      );
    } else if (selectedPrompts.length < minPromptSelections) {
      // Add prompt if under minimum limit
      dispatch(setPrompts([...selectedPrompts, selection]));
    }
  };

  // customer requested these be listed all under prompts and not separated -TW
  // const handleCharacterSelection = (character: string) => {
  //   dispatch(setCharacterSelection(character));
  // };

  // const handleSettingSelection = (setting: string) => {
  //   dispatch(setSettingSelection(setting));
  // };

  const getSelectionText = () => {
    const remaining = minPromptSelections - selectedPrompts.length;
    if (remaining > 0) {
      return `Select ${remaining} more prompt${remaining > 1 ? 's' : ''}`;
    }
    return `Selected ${selectedPrompts.length} of ${minPromptSelections} prompts`;
  };

  return (
    <div className='container-fluid'>
      <div className='row d-flex justify-content-between align-items-center'>
        <div className='col'>
          <h1 className='bd-title pb-2 mt-4'>
            Choose {minPromptSelections} prompts
          </h1>
          <p className='text-muted pb-2 mt-2 fs-5'>
            {getSelectionText()}
            <br />
            You'll use these to create your story.
          </p>
        </div>
        <Selections />
      </div>
      <div className='row'>
        <h3 className='pb-2 mt-3'>Available Prompts</h3>
        {/* {CHARACTER_SELECTIONS.map((character, index) => (
          <PromptCard
            key={character.name + index}
            prompt={character.name}
            promptText={character.description}
            handleSelection={handleCharacterSelection}
          />
        ))}
        {SETTING_SELECTIONS.map((setting, index) => (
          <PromptCard
            key={setting.name + index}
            prompt={setting.name}
            promptText={setting.description}
            handleSelection={handleSettingSelection}
          />
        ))} */}
        {prompts.map((prompt, index) => (
          <PromptCard
            key={prompt.id || index}
            prompt={prompt.name}
            promptText={prompt.description}
            handleSelection={handlePromptSelection}
            isDisabled={
              selectedPrompts.length >= minPromptSelections &&
              !selectedPrompts.includes(prompt.name)
            }
          />
        ))}
      </div>
      <div className='row'>
        <NavigateButtons
          isNextDisabled={selectedPrompts.length < minPromptSelections}
          backNavigation='Beta HIVE Selection'
          nextNavigation='Story Submission'
        />
      </div>
    </div>
  );
};

export default PromptSelection;
