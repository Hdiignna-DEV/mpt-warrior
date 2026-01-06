"""
PDF Content Extractor for MPT Warrior Academy Modules

This script extracts structured content from the academy PDF including:
- Table of contents
- Module content
- Quiz questions and answers
"""

import json
import re
from pathlib import Path

try:
    import pdfplumber
except ImportError:
    print("pdfplumber not installed. Installing...")
    import subprocess
    subprocess.check_call(['pip', 'install', 'pdfplumber'])
    import pdfplumber


def extract_pdf_content(pdf_path):
    """Extract all content from the PDF"""
    content = {
        'table_of_contents': [],
        'modules': []
    }
    
    with pdfplumber.open(pdf_path) as pdf:
        full_text = ""
        for page in pdf.pages:
            full_text += page.extract_text() + "\n\n"
        
        # Save raw text for inspection
        with open('pdf_raw_text.txt', 'w', encoding='utf-8') as f:
            f.write(full_text)
        
        # Parse table of contents (customize based on actual PDF structure)
        content['table_of_contents'] = extract_toc(full_text)
        
        # Extract modules 1-3
        for module_num in range(1, 4):
            module_data = extract_module(full_text, module_num)
            content['modules'].append(module_data)
        
        # Extract structure for modules 4-6
        for module_num in range(4, 7):
            module_data = extract_module_outline(full_text, module_num)
            content['modules'].append(module_data)
    
    return content


def extract_toc(text):
    """Extract table of contents"""
    toc = []
    # This regex pattern should be adjusted based on actual PDF format
    # Looking for patterns like "Module 1: Title" or "1. Title"
    module_pattern = r'(?:Module|MODULE)\s+(\d+)[:\s]+(.+?)(?:\n|$)'
    
    matches = re.finditer(module_pattern, text, re.MULTILINE)
    for match in matches:
        module_num = match.group(1)
        module_title = match.group(2).strip()
        toc.append({
            'module_number': int(module_num),
            'title': module_title,
            'subtopics': []
        })
    
    return toc


def extract_module(text, module_num):
    """Extract complete module content including quiz"""
    module_data = {
        'module_number': module_num,
        'title': '',
        'content': [],
        'quiz_questions': []
    }
    
    # Extract module title
    title_pattern = rf'(?:Module|MODULE)\s+{module_num}[:\s]+(.+?)(?:\n|$)'
    title_match = re.search(title_pattern, text, re.IGNORECASE)
    if title_match:
        module_data['title'] = title_match.group(1).strip()
    
    # Extract sections (customize based on PDF structure)
    # This is a placeholder - you'll need to adjust based on actual format
    section_pattern = rf'Module {module_num}.*?(?=Module {module_num + 1}|Quiz|$)'
    section_match = re.search(section_pattern, text, re.DOTALL | re.IGNORECASE)
    
    if section_match:
        section_text = section_match.group(0)
        module_data['content'] = parse_module_sections(section_text)
    
    # Extract quiz questions
    module_data['quiz_questions'] = extract_quiz_questions(text, module_num)
    
    return module_data


def parse_module_sections(text):
    """Parse module text into sections"""
    sections = []
    # Split by headings or numbered sections
    # Adjust based on actual PDF structure
    lines = text.split('\n')
    current_section = {'title': '', 'content': ''}
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        # Detect section headers (customize based on PDF)
        if re.match(r'^\d+\.|^[A-Z\s]+$', line) and len(line) < 100:
            if current_section['content']:
                sections.append(current_section)
            current_section = {'title': line, 'content': ''}
        else:
            current_section['content'] += line + ' '
    
    if current_section['content']:
        sections.append(current_section)
    
    return sections


def extract_quiz_questions(text, module_num):
    """Extract quiz questions for a specific module"""
    questions = []
    
    # Look for quiz section for this module
    quiz_pattern = rf'(?:Quiz|QUIZ|Practice Questions).*?Module {module_num}(.*?)(?=Module {module_num + 1}|Quiz.*?Module {module_num + 1}|$)'
    quiz_match = re.search(quiz_pattern, text, re.DOTALL | re.IGNORECASE)
    
    if not quiz_match:
        return questions
    
    quiz_text = quiz_match.group(1)
    
    # Extract individual questions
    # Pattern for numbered questions
    question_pattern = r'(\d+)\.\s*(.+?)(?=\d+\.|$)'
    
    for match in re.finditer(question_pattern, quiz_text, re.DOTALL):
        q_num = match.group(1)
        q_text = match.group(2).strip()
        
        question = {
            'number': int(q_num),
            'question_text': '',
            'type': 'multiple_choice',  # default
            'options': [],
            'correct_answer': '',
            'points': 1
        }
        
        # Parse question details
        lines = q_text.split('\n')
        question['question_text'] = lines[0].strip()
        
        # Look for multiple choice options (A, B, C, D or a, b, c, d)
        option_pattern = r'^([A-Da-d])[.)]\s*(.+)$'
        
        for line in lines[1:]:
            line = line.strip()
            option_match = re.match(option_pattern, line)
            if option_match:
                option_letter = option_match.group(1).upper()
                option_text = option_match.group(2).strip()
                question['options'].append({
                    'letter': option_letter,
                    'text': option_text
                })
        
        # Determine question type
        if not question['options']:
            if any(keyword in question['question_text'].lower() for keyword in ['true or false', 'true/false']):
                question['type'] = 'true_false'
            else:
                question['type'] = 'essay'
        
        # Look for answer indicator
        answer_pattern = r'(?:Answer|Correct Answer|Solution)[:\s]+([A-Da-d]|\w+)'
        answer_match = re.search(answer_pattern, q_text, re.IGNORECASE)
        if answer_match:
            question['correct_answer'] = answer_match.group(1).upper()
        
        questions.append(question)
    
    return questions


def extract_module_outline(text, module_num):
    """Extract outline/structure for incomplete modules"""
    module_data = {
        'module_number': module_num,
        'title': '',
        'status': 'coming_soon',
        'outline': []
    }
    
    # Extract module title if available
    title_pattern = rf'(?:Module|MODULE)\s+{module_num}[:\s]+(.+?)(?:\n|$)'
    title_match = re.search(title_pattern, text, re.IGNORECASE)
    if title_match:
        module_data['title'] = title_match.group(1).strip()
    
    return module_data


def main():
    pdf_path = Path(r"c:\Users\deden\mpt-warrior\public\MINDSET PLAN TRADER - MODULE.pdf")
    
    if not pdf_path.exists():
        print(f"Error: PDF file not found at {pdf_path}")
        return
    
    print("Extracting content from PDF...")
    content = extract_pdf_content(pdf_path)
    
    # Save to JSON
    output_path = Path('academy_content.json')
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(content, f, indent=2, ensure_ascii=False)
    
    print(f"\nContent extracted successfully!")
    print(f"Output saved to: {output_path}")
    print(f"\nRaw text saved to: pdf_raw_text.txt (for manual review)")
    
    # Print summary
    print("\n" + "="*50)
    print("EXTRACTION SUMMARY")
    print("="*50)
    print(f"Table of Contents: {len(content['table_of_contents'])} modules")
    
    for module in content['modules']:
        print(f"\nModule {module['module_number']}: {module.get('title', 'Untitled')}")
        if 'quiz_questions' in module:
            print(f"  - Sections: {len(module.get('content', []))}")
            print(f"  - Quiz Questions: {len(module['quiz_questions'])}")
        else:
            print(f"  - Status: {module.get('status', 'Unknown')}")


if __name__ == '__main__':
    main()
