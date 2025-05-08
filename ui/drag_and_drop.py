import tkinter as tk
from tkinter import ttk

class DragDropFrame(tk.Frame):
    def __init__(self, master=None, **kwargs):
        super().__init__(master, **kwargs)
        self.config(bg='white')
        
        # Create sections for CV components
        self.create_sections()
        
        # Bind mouse events for drag and drop
        self.bind_events()

    def create_sections(self):
        # Header section
        self.header = ttk.LabelFrame(self, text="Personal Information")
        self.header.pack(fill="x", padx=10, pady=5)
        
        # Add fields to header section
        ttk.Label(self.header, text="Full Name:").grid(row=0, column=0, padx=5, pady=5)
        ttk.Entry(self.header).grid(row=0, column=1, padx=5, pady=5)
        
        ttk.Label(self.header, text="Email:").grid(row=1, column=0, padx=5, pady=5)
        ttk.Entry(self.header).grid(row=1, column=1, padx=5, pady=5)
        
        ttk.Label(self.header, text="Phone:").grid(row=2, column=0, padx=5, pady=5)
        ttk.Entry(self.header).grid(row=2, column=1, padx=5, pady=5)

        # Experience section
        self.experience = ttk.LabelFrame(self, text="Experience")
        self.experience.pack(fill="x", padx=10, pady=5)
        
        # Add button to add new experience
        ttk.Button(self.experience, text="Add Experience", 
                  command=self.add_experience).pack(padx=5, pady=5)

        # Education section
        self.education = ttk.LabelFrame(self, text="Education")
        self.education.pack(fill="x", padx=10, pady=5)
        
        # Add button to add new education
        ttk.Button(self.education, text="Add Education", 
                  command=self.add_education).pack(padx=5, pady=5)

        # Skills section
        self.skills = ttk.LabelFrame(self, text="Skills")
        self.skills.pack(fill="x", padx=10, pady=5)
        
        # Add skills entry and button
        self.skills_entry = ttk.Entry(self.skills)
        self.skills_entry.pack(side="left", padx=5, pady=5)
        ttk.Button(self.skills, text="Add Skill", 
                  command=self.add_skill).pack(side="left", padx=5, pady=5)

    def bind_events(self):
        for widget in [self.header, self.experience, self.education, self.skills]:
            widget.bind("<Button-1>", self.start_drag)
            widget.bind("<B1-Motion>", self.drag)
            widget.bind("<ButtonRelease-1>", self.stop_drag)

    def start_drag(self, event):
        widget = event.widget
        widget._drag_start_x = event.x
        widget._drag_start_y = event.y

    def drag(self, event):
        widget = event.widget
        x = widget.winfo_x() - widget._drag_start_x + event.x
        y = widget.winfo_y() - widget._drag_start_y + event.y
        widget.place(x=x, y=y)

    def stop_drag(self, event):
        pass  # Implement any cleanup needed after drag

    def add_experience(self):
        experience_window = tk.Toplevel(self)
        experience_window.title("Add Experience")
        experience_window.geometry("400x300")
        
        ttk.Label(experience_window, text="Company:").grid(row=0, column=0, padx=5, pady=5)
        ttk.Entry(experience_window).grid(row=0, column=1, padx=5, pady=5)
        
        ttk.Label(experience_window, text="Position:").grid(row=1, column=0, padx=5, pady=5)
        ttk.Entry(experience_window).grid(row=1, column=1, padx=5, pady=5)
        
        ttk.Label(experience_window, text="Duration:").grid(row=2, column=0, padx=5, pady=5)
        ttk.Entry(experience_window).grid(row=2, column=1, padx=5, pady=5)
        
        ttk.Label(experience_window, text="Description:").grid(row=3, column=0, padx=5, pady=5)
        text = tk.Text(experience_window, height=4)
        text.grid(row=3, column=1, padx=5, pady=5)

    def add_education(self):
        education_window = tk.Toplevel(self)
        education_window.title("Add Education")
        education_window.geometry("400x300")
        
        ttk.Label(education_window, text="Institution:").grid(row=0, column=0, padx=5, pady=5)
        ttk.Entry(education_window).grid(row=0, column=1, padx=5, pady=5)
        
        ttk.Label(education_window, text="Degree:").grid(row=1, column=0, padx=5, pady=5)
        ttk.Entry(education_window).grid(row=1, column=1, padx=5, pady=5)
        
        ttk.Label(education_window, text="Year:").grid(row=2, column=0, padx=5, pady=5)
        ttk.Entry(education_window).grid(row=2, column=1, padx=5, pady=5)

    def add_skill(self):
        skill = self.skills_entry.get()
        if skill:
            ttk.Label(self.skills, text=skill).pack(padx=5, pady=2)
            self.skills_entry.delete(0, tk.END) 