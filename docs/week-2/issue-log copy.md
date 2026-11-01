# Week 2 Issue Log

- Assignments needed an owner check beyond the role check. A second director could edit another director’s assignment. Fixed by comparing `createdBy` with the logged-in director’s id for update and delete operations.
