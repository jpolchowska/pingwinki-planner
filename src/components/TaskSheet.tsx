import { useState, type FormEvent, type KeyboardEvent } from 'react';
import type { Priority, Task, TaskDraft } from '../data/task';
import { Icon } from './Icon';
import { PriorityBadge } from './PriorityBadge';

const PRIORITIES: Priority[] = ['low', 'medium', 'high'];

interface TaskSheetProps {
  task: Task | null;
  initialDueDate: string | null;
  availableTags: string[];
  onSave: (draft: TaskDraft) => void;
  onDive: (draft: TaskDraft) => void;
  onDelete: (id: number) => void;
  onClose: () => void;
}

export function TaskSheet({
  task,
  initialDueDate,
  availableTags,
  onSave,
  onDive,
  onDelete,
  onClose,
}: TaskSheetProps) {
  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [dueDate, setDueDate] = useState(task ? (task.dueDate ?? '') : (initialDueDate ?? ''));
  const [priority, setPriority] = useState<Priority>(task?.priority ?? 'medium');
  const [tags, setTags] = useState(task?.tags ?? []);
  const [newTag, setNewTag] = useState('');
  const [hasTitleError, setHasTitleError] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const visibleTags = [...new Set([...availableTags, ...tags])];
  const heading = task ? 'Edytuj misję' : 'Nowa misja';

  const getTagsWithPending = () => {
    const pendingTag = newTag.trim();
    if (!pendingTag) return tags;

    const tag =
      visibleTags.find((visibleTag) => visibleTag.toLowerCase() === pendingTag.toLowerCase()) ??
      pendingTag;
    return tags.includes(tag) ? tags : [...tags, tag];
  };

  const addPendingTag = () => {
    setTags(getTagsWithPending());
    setNewTag('');
  };

  const toggleTag = (tag: string) => {
    setTags((current) =>
      current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag],
    );
  };

  const handleNewTagKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    addPendingTag();
  };

  const getDraft = (): TaskDraft | null => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setHasTitleError(true);
      return null;
    }

    return {
      title: trimmedTitle,
      description: description.trim(),
      dueDate: dueDate || null,
      priority,
      tags: getTagsWithPending(),
    };
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const draft = getDraft();
    if (draft) onSave(draft);
  };

  const handleDive = () => {
    const draft = getDraft();
    if (draft) onDive(draft);
  };

  return (
    <div className="sheet-backdrop">
      <form className="sheet" role="dialog" aria-modal="true" aria-label={heading} onSubmit={handleSubmit}>
        <header className="sheet-header">
          <h2 className="title sheet-title">{heading}</h2>
          <button className="sheet-close" type="button" aria-label="Zamknij" onClick={onClose}>
            <Icon name="close" color="#1E1E1E" size={18} />
          </button>
        </header>

        <label className="field-label" htmlFor="task-title">
          Tytuł
        </label>
        <input
          id="task-title"
          className="field-input"
          type="text"
          value={title}
          aria-invalid={hasTitleError}
          onChange={(event) => {
            setTitle(event.target.value);
            setHasTitleError(false);
          }}
        />
        {hasTitleError && (
          <p className="field-error" role="alert">
            Wpisz tytuł misji.
          </p>
        )}

        <label className="field-label" htmlFor="task-description">
          Opis (opcjonalny)
        </label>
        <input
          id="task-description"
          className="field-input"
          type="text"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />

        <label className="field-label" htmlFor="task-due-date">
          Termin
        </label>
        <div className="field-row">
          <button
            className={`chip${dueDate ? '' : ' chip--active'}`}
            type="button"
            aria-pressed={!dueDate}
            onClick={() => setDueDate('')}
          >
            Bez terminu
          </button>
          <input
            id="task-due-date"
            className="field-input field-input--date"
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
          />
        </div>

        <p className="field-label">Priorytet</p>
        <div className="field-row">
          {PRIORITIES.map((option) => (
            <button
              className={`priority-option${priority === option ? ' priority-option--active' : ''}`}
              type="button"
              key={option}
              aria-pressed={priority === option}
              onClick={() => setPriority(option)}
            >
              <PriorityBadge priority={option} />
            </button>
          ))}
        </div>

        <p className="field-label">Tagi</p>
        <div className="field-tags">
          {visibleTags.map((tag) => (
            <button
              className={`chip${tags.includes(tag) ? ' chip--active' : ''}`}
              type="button"
              key={tag}
              aria-pressed={tags.includes(tag)}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
        <div className="field-row field-row--spaced">
          <input
            className="field-input"
            type="text"
            placeholder="Nowy tag"
            aria-label="Nowy tag"
            value={newTag}
            onChange={(event) => setNewTag(event.target.value)}
            onKeyDown={handleNewTagKeyDown}
          />
          <button className="button button--secondary" type="button" onClick={addPendingTag}>
            Dodaj
          </button>
        </div>

        {task && !task.done && (
          <button className="button sheet-dive" type="button" onClick={handleDive}>
            Nurkuj
          </button>
        )}

        {isConfirmingDelete && task ? (
          <div className="delete-confirm">
            <p className="delete-confirm-text">Na pewno usunąć?</p>
            <div className="field-row">
              <button
                className="button button--secondary sheet-action"
                type="button"
                onClick={() => setIsConfirmingDelete(false)}
              >
                Anuluj
              </button>
              <button className="button sheet-action" type="button" onClick={() => onDelete(task.id)}>
                Tak, usuń
              </button>
            </div>
          </div>
        ) : (
          <div className="field-row sheet-actions">
            {task && (
              <button
                className="button button--secondary sheet-action"
                type="button"
                onClick={() => setIsConfirmingDelete(true)}
              >
                Usuń
              </button>
            )}
            <button className="button sheet-action sheet-action--primary" type="submit">
              Zapisz
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
