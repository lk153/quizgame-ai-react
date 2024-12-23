import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import './IELTSWritingForm.css';

function IELTSWritingForm() {
  const [formData, setFormData] = useState({
    writingTaskType: 1, // Using number type for writingTaskType
    writingTask: '',
    file: null, // Not used in JSON payload but kept for potential UI use
    candidateText: '',
  });

  const [assessmentDetails, setAssessmentDetails] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'writingTaskType' ? Number(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { writingTaskType, writingTask, candidateText } = formData;
    const payload = {
      "task_type": writingTaskType,
      "task_requirement": writingTask,
      "candidate_text": candidateText,
    };

    setIsLoading(true);
    setAssessmentDetails('');

    try {
      const response = await fetch('http://10.4.0.212:8111/v1/task-result/assess', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      setAssessmentDetails(result.data || 'No details available.');
    } catch (error) {
      console.error('Error while calling the API:', error);
      setAssessmentDetails('An error occurred while assessing the task.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-group">
        <label htmlFor="writingTaskType">Writing Task Type:</label>
        <select
          id="writingTaskType"
          name="writingTaskType"
          value={formData.writingTaskType}
          onChange={handleChange}
        >
          <option value={1}>Writing Task 1</option>
          <option value={2}>Writing Task 2</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="writingTask">Writing Task:</label>
        <textarea
          id="writingTask"
          name="writingTask"
          value={formData.writingTask}
          onChange={handleChange}
          rows="5"
          required
        />
      </div>
      
      {formData.writingTaskType === 1 && (
        <div className="form-group">
          <label htmlFor="file">Upload File:</label>
          <input
            id="file"
            name="file"
            type="file"
            accept=".txt,.doc,.docx,.pdf"
            onChange={handleChange}
          />
        </div>
      )}

      <div className="form-group">
        <label htmlFor="candidateText">Candidate Text:</label>
        <textarea
          id="candidateText"
          name="candidateText"
          value={formData.candidateText}
          onChange={handleChange}
          rows="5"
          required
        />
      </div>

      <button type="submit" className="submit-button" disabled={isLoading}>
        {isLoading ? <div className="loading-spinner" /> : 'Submit'}
      </button>

      {assessmentDetails && (
        <div className="result-container">
          <h3>Assessment Details and Band Scores:</h3>
          <div className="markdown-container">
            <ReactMarkdown>{assessmentDetails}</ReactMarkdown>
          </div>
        </div>
      )}
    </form>
  );
}

export default IELTSWritingForm;
